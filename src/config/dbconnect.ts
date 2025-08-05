import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = 'mongodb+srv://mughalabubakkarsa:mughal123@minetworks.steny.mongodb.net/watch2Earn';

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
