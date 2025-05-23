import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB Connection
export const connectToMongoDB = async () => {
  try {
    // Get MongoDB URI from environment variables - don't provide a local fallback
    const mongoURI = process.env.MONGODB_URI;
    
    // Log environment variable status (safely)
    console.log('MONGODB_URI status:', mongoURI ? 'Found (value hidden for security)' : 'Missing - check your .env file');
    
    // If no URI is provided, return null to use in-memory storage
    if (!mongoURI) {
      console.warn('MONGODB_URI environment variable not set, using in-memory storage');
      return null;
    }
    
    console.log('Connecting to MongoDB...');
    
    // Connect with appropriate options for MongoDB
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      family: 4, // Force IPv4
      connectTimeoutMS: 30000, // 30 seconds
    };
    
    // Create a direct format URI to avoid DNS SRV lookup issues
    let finalURI = mongoURI;
    if (mongoURI.includes('mongodb+srv://')) {
      console.log('Using MongoDB Atlas connection string, bypassing SRV lookup');
      
      // Apply this only if we have a valid Atlas URI with srv format
      try {
        // Parse the URI to extract components
        const uriParts = mongoURI.replace('mongodb+srv://', '').split('/');
        const authHostPart = uriParts[0];
        const dbNameAndParams = uriParts.slice(1).join('/');
        
        // Split auth and host
        const atIndex = authHostPart.lastIndexOf('@');
        const auth = authHostPart.substring(0, atIndex);
        const host = authHostPart.substring(atIndex + 1);
        
        // Remove port if present in host
        const hostWithoutPort = host.split(':')[0];
        
        // Create direct connection URI
        finalURI = `mongodb://${auth}@${hostWithoutPort}:27017/${dbNameAndParams}`;
        console.log('Converted to direct MongoDB connection string (details hidden)');
      } catch (e) {
        console.warn('Error parsing connection string, using original:', e);
      }
    }
    
    // Connect with mongoose
    await mongoose.connect(finalURI, options);
    
    console.log('MongoDB connected successfully');
    
    // Set up event listeners
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
    // Don't exit the process, fall back to memory storage
    return null;
  }
};

export const db = mongoose.connection;