import mongoose from 'mongoose';

const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch(err) {
        console.error("Database connection error:", err.message);
        throw new err("DATABASE_CONNECTION_FAILED");
    }
}

export default connectToDB;
