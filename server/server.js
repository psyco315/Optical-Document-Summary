import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
dotenv.config();

// import connectDB from './database/connect.js';
import pdfRouter from './routes/pdfRoutes.js';
import ocrRouter from './routes/ocrRoutes.js';
import summaryRouter from './routes/summ.js';

const app = express();
const PORT = process.env.PORT || 3000;

import fs from 'fs';
import path from 'path';

// Debug: Check if files exist on Vercel
console.log('🔍 Debug - Checking file system on Vercel:');
console.log('Current working directory:', process.cwd());
console.log('Environment:', process.env.VERCEL ? 'Vercel' : 'Local');

const filesToCheck = [
    './test/data/05-versions-space.pdf',
    'test/data/05-versions-space.pdf',
    '/var/task/test/data/05-versions-space.pdf'
];

filesToCheck.forEach(filePath => {
    try {
        const exists = fs.existsSync(filePath);
        console.log(`📁 ${filePath}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);

        if (exists) {
            const stats = fs.statSync(filePath);
            console.log(`   Size: ${stats.size} bytes`);
        }
    } catch (error) {
        console.log(`📁 ${filePath}: ❌ ERROR - ${error.message}`);
    }
});

// List contents of test directory if it exists
try {
    const testDir = './test';
    if (fs.existsSync(testDir)) {
        console.log('📁 Contents of ./test:');
        fs.readdirSync(testDir, { recursive: true }).forEach(file => {
            console.log(`   ${file}`);
        });
    } else {
        console.log('📁 ./test directory does not exist');
    }
} catch (error) {
    console.log('📁 Error reading test directory:', error.message);
}

// Your existing server code continues here...

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'https://booklog-client.vercel.app'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(helmet());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something broke!'
    });
});

app.get('/test', (req, res) => {
    res.send('Hello from Express!');
});

app.get('/api/test', (req, res) => {
    res.send('Hello from Express!');
});

app.use('/api/pdf', pdfRouter)
app.use('/api/ocr', ocrRouter);
app.use('/api/summary', summaryRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const start = async () => {
    try {
        // await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => { console.log(`Listening to PORT: ${PORT}`) })
    } catch (error) {
        console.log(error)
    }
}
start()