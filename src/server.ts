import express from 'express';
import multer from 'multer';
import { connectDB } from '../config/db';
import videoRoutes from './routes/videoRoutes';

const upload = multer();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());
app.use(upload.none());
app.use('/api', videoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
