import dotenv from 'dotenv';
dotenv.config();

// Simple extractive summarization fallback
const extractiveSummary = (text, sentences = 3) => {
    const sentenceArray = text.match(/[^\.!?]+[\.!?]+/g) || [];

    if (sentenceArray.length <= sentences) return text;

    const wordFreq = {};
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];

    words.forEach(word => {
        if (word.length > 3) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });

    const sentenceScores = sentenceArray.map(sentence => {
        const sentWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
        const score = sentWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
        return { sentence: sentence.trim(), score };
    });

    return sentenceScores
        .sort((a, b) => b.score - a.score)
        .slice(0, sentences)
        .map(item => item.sentence)
        .join(' ');
};

// Text summarization controller
export const summarizeText = async (req, res) => {
    try {
        const {
            text,
            maxTokens = 150,
            temperature = 0.3,
            summaryType = 'medium' // short, medium, long
        } = req.body;

        // console.log(text)

        // Convert summaryType to appropriate lengths
        const lengthConfig = {
            'short': { maxTokens: 75, sentences: 2, cohereLength: 'short' },
            'medium': { maxTokens: 150, sentences: 3, cohereLength: 'medium' },
            'long': { maxTokens: 300, sentences: 5, cohereLength: 'long' }
        };

        const config = lengthConfig[summaryType] || lengthConfig['medium'];
        const finalMaxTokens = maxTokens || config.maxTokens;

        // Validation
        if (!text) {
            return res.status(400).json({
                success: false,
                error: 'Text is required in request body'
            });
        }

        if (text.length < 100) {
            return res.status(400).json({
                success: false,
                error: 'Text must be at least 100 characters long for meaningful summarization'
            });
        }

        if (text.length > 10000) {
            return res.status(400).json({
                success: false,
                error: 'Text is too long. Maximum 10,000 characters allowed.'
            });
        }

        // Try multiple summarization methods in order of preference
        let summary;
        let method = 'extractive';
        let tokensUsed = 0;

        // Method 1: Hugging Face API (free)
        if (process.env.HUGGINGFACE_API_KEY) {
            try {
                const hfResponse = await fetch(
                    'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            inputs: text,
                            parameters: {
                                max_length: parseInt(finalMaxTokens),
                                min_length: Math.max(30, parseInt(finalMaxTokens) / 3),
                                do_sample: false
                            }
                        })
                    }
                );

                if (hfResponse.ok) {
                    const hfResult = await hfResponse.json();
                    if (hfResult[0]?.summary_text) {
                        summary = hfResult[0].summary_text;
                        method = 'huggingface';
                        console.log('Used Hugging Face API for summarization');
                    }
                }
            } catch (hfError) {
                console.log('Hugging Face API failed, trying next method:', hfError.message);
            }
        }

        // Method 2: Cohere API (free tier)
        if (!summary && process.env.COHERE_API_KEY) {
            try {
                const cohereResponse = await fetch('https://api.cohere.ai/v1/summarize', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: text,
                        length: config.cohereLength,
                        format: 'paragraph',
                        model: 'summarize-medium',
                        extractiveness: 'medium',
                        temperature: parseFloat(temperature)
                    })
                });

                if (cohereResponse.ok) {
                    const cohereResult = await cohereResponse.json();
                    if (cohereResult.summary) {
                        summary = cohereResult.summary;
                        method = 'cohere';
                        console.log('Used Cohere API for summarization');
                    }
                }
            } catch (cohereError) {
                console.log('Cohere API failed, trying next method:', cohereError.message);
            }
        }

        // Method 3: Fallback to extractive summarization (always works, no API needed)
        if (!summary) {
            summary = extractiveSummary(text, config.sentences);
            method = 'extractive';
            console.log('Used extractive summarization as fallback');
        }

        // Return successful response
        res.json({
            success: true,
            data: {
                originalLength: text.length,
                summaryLength: summary.length,
                summary,
                method,
                tokensUsed,
                summaryType: summaryType,
                requestedTokens: finalMaxTokens
            }
        });

    } catch (error) {
        console.error('Summarization error:', error);

        // Fallback to extractive summary even on errors
        try {
            const { text, summaryType = 'medium' } = req.body;
            const config = {
                'short': { sentences: 2 },
                'medium': { sentences: 3 },
                'long': { sentences: 5 }
            };
            const fallbackConfig = config[summaryType] || config['medium'];
            const fallbackSummary = extractiveSummary(text, fallbackConfig.sentences);

            return res.json({
                success: true,
                data: {
                    originalLength: text.length,
                    summaryLength: fallbackSummary.length,
                    summary: fallbackSummary,
                    method: 'extractive_fallback',
                    tokensUsed: 0,
                    summaryType: summaryType
                },
                warning: 'Used fallback summarization due to API errors'
            });
        } catch (fallbackError) {
            // Only return error if even fallback fails
            res.status(500).json({
                success: false,
                error: 'All summarization methods failed. Please try again.'
            });
        }
    }
};