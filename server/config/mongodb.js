import mongoose from "mongoose";
import dotenv from "dotenv";


export const connectDB = async () => {

    dotenv.config();
  mongoose.connection.on("connected", () => {
      console.log("Database connected");
  });
  mongoose.connection.on("error", (err) => {
      console.log("Database error: ", err);
  });
  mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
  });
  mongoose.connection.on("reconnected", () => {
      console.log("Database reconnected");
  });


  await mongoose.connect(process.env.MONGODB_URI);
}