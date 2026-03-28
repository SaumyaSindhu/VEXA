import 'dotenv/config';
import app from './src/app.js';
import http from 'http';
import connectToDB from './src/config/database.js';
import { initSocket } from './src/sockets/server.socket.js';

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

const startServer = async () => {
    try {
        await connectToDB();

        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch(err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

startServer();