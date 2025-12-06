import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/sales", (req, res) => {
    res.send("Sales");
});

app.get('/health', (req, res) => {
    res.send("OK");
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});