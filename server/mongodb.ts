import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('MONGODB_URI status:', mongoURI ? 'Found (value hidden for security)' : 'Missing - check your .env file');

    if (!mongoURI) {
      console.warn('MONGODB_URI environment variable not set, using in-memory storage');
      return null;
    }

    console.log('Connecting to MongoDB...');

    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      connectTimeoutMS: 30000,
      ssl: true, // Ensure SSL is enabled for Atlas
    };

    await mongoose.connect(mongoURI, options);

    console.log('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Falling back to in-memory storage...');
    return null;
  }
};

export const db = mongoose.connection;
