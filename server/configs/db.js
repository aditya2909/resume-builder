import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });
    let mongodbUri = process.env.MONGODB_URI;

    const projectName = "resume-builder";

    if (!mongodbUri) {
      throw new Error("MONGODB_URI environment variable is not set.");
    }

    if (mongodbUri.endsWith("/")) {
      mongodbUri = mongodbUri.slice(0, -1);
    }

    await mongoose.connect(`${mongodbUri}/${projectName}`);
  } catch (error) {
    console.error("Error in connection to MongoDB.", error);
  }
};

export default connectDB;
