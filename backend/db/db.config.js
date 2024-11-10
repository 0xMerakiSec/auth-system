import mongoose from "mongoose";

//connecting to the mongodb
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `MongoDB connected successfully to the host: ${connectionInstance.Connection.host}`
    );
  } catch (error) {
    console.log("MongoDB service :: connection error :: Error :: ", error);
  }
};

export default connectDB;
