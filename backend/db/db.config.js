import mongoose from "mongoose";
import DB_NAME from "../constants.js";

//connecting to the mongodb
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;

    // const options = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   serverSelectionTimeoutMS: 5000, //timeout after 5s instead of 30s
    //   family: 4, // use  IPv4 skip IPv6
    // };
    if (!connectionString) {
      throw new Error("MONGODB_URI is not defined in the environment variable");
    }
    const connectionInstance = await mongoose.connect(
      `${connectionString}/${DB_NAME}`
    );
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error: ", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
    console.log(
      `MongoDB connected successfully to the host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB service :: connection error :: Error :: ", error);
  }
};

export default connectDB;
// connectDB();
