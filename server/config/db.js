import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('📡 Connecting to MongoDB via provided URI...');
    } else {
      console.log('🚀 No external MONGODB_URI found. Initializing Auto-Local Embedded MongoDB Server...');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'rajvilas_hotel'
        }
      });
      mongoUri = mongodInstance.getUri();
      console.log(`✅ Auto-Local MongoDB started successfully at: ${mongoUri}`);
    }

    await mongoose.connect(mongoUri);
    console.log(`🌿 MongoDB Connected successfully: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
