import express from 'express';
import { connectDB } from '../config/db';
import videoRoutes from './routes/videoRoutes';

const app = express();
const PORT = 3001;

connectDB();

app.use('/api', videoRoutes);

app.listen
