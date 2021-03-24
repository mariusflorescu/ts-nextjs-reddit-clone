import "reflect-metadata";
import {createConnection} from "typeorm";
import express from "express";
import morgan from "morgan"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors';

dotenv.config();

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs'
import commentRoutes from './routes/comments'
import miscRoutes from './routes/misc';

import trim from './middleware/trim'

const app = express();
app.use(express.json())
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200 //old browsers compatibility
}));

app.use(express.static('public'));

app.get('/',(_,res) => res.send('Hello world'));
app.use('/api/auth',authRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/subs',subRoutes);
app.use('/api/posts',commentRoutes);
app.use('/api/misc',miscRoutes);

app.listen(5000, async () => {
    console.log('server running on localhost:5000');

    try {
        await createConnection();
        console.log('Database connected');
    } catch (err) {
        console.log(err);
    }
})