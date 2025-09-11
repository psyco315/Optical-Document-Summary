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
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'https://optical-document-summary-client.vercel.app'],
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