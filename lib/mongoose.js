import mongoose from 'mongoose';

const connectDB = async () => {

  try {
    await mongoose.connect(process.env.MogoUrl);

  } catch (error) {
    console.log("error", error);
  }

};

export default connectDB;