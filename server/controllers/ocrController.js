import { createWorker } from "tesseract.js";
import { fromBuffer } from "pdf2pic";

/**
 * extractTextOCR
 * Accepts req.file (multer memoryStorage)
 */
export async function extractTextOCR(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const { buffer, mimetype } = req.file;

        // Helper: run Tesseract OCR on a buffer
        const runOCR = async (buffer) => {
            const base64 = `data:image/png;base64,${buffer.toString("base64")}`;

            const worker = await createWorker();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');

            const { data: { text } } = await worker.recognize(base64);
            // console.log(text);

            await worker.terminate();
            return text;

        };

        // IMAGE file → OCR directly
        if (mimetype.startsWith("image/")) {
            const text = await runOCR(buffer);
            return res.json({ text, source: "image-ocr" });
        }

        // PDF file → convert to images with pdf2pic then OCR
        if (mimetype === "application/pdf") {
            const converter = fromBuffer(buffer, { format: "png", density: 150, savePath: null });
            const pageCount = 100; // maximum pages to process, adjust as needed
            let finalText = "";

            for (let i = 1; i <= pageCount; i++) {
                try {
                    const page = await converter(i, true); // true = return base64
                    if (!page || !page.base64) break; // no more pages
                    const imgBuffer = Buffer.from(page.base64, "base64");
                    const pageText = await runOCR(imgBuffer);
                    finalText += `\n\n--- Page ${i} ---\n\n` + pageText;
                } catch (err) {
                    break; // reached last page
                }
            }

            return res.json({ text: finalText.trim(), source: "pdf-ocr" });
        }

        // fallback
        return res.status(400).json({ error: "Unsupported file type." });
    } catch (err) {
        console.error("OCR error:", err);
        return res.status(500).json({ error: "OCR failed", detail: err.message });
    }
}
