import express from 'express';
import http from 'node:http';
import {connectDB} from "./config/mongodb.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = 3002;
const server = http.createServer(app);
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    // All front-end url's that are to be allowed by cors
]
connectDB();
dotenv.config();

app.use(express.json());

// app.use(cors({origin:"*",sameSite:true}));

app.use(cors({
    origin: allowedOrigins, // Your frontend URL
    credentials: true, // If using cookies/sessions
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Home page of chat app");
});
app.post('/about', (req, res) => {
    res.send("About page of chat app");
});

app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});