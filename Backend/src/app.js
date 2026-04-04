import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);
app.use(morgan("dev"));



//Health check
app.get("/", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

export default app;