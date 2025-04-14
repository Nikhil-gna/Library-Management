import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `\n Connected to MongoDB on ${connectionInstance.connection.host} \n`
    );
  } catch (error) {
    console.error("Error connecting to database FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
