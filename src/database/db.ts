import 'dotenv/config';
import mongoose from 'mongoose';
import './model/model';

mongoose
    .connect(process.env.DATABASE_URL!)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('MongoDB connection error:', error));
