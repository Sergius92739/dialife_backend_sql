import express from 'express';
import authRouter from './routes/auth.router.js'
import fileUpload from "express-fileupload";
import dotenv from 'dotenv';
import cors from 'cors';

const PORT = process.env.PORT || 8080;

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/api', authRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
