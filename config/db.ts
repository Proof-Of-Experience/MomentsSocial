import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://localhost/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("We're connected to MongoDB!");
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export const db = mongoose.connection;
