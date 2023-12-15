import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();

// middleware
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to practice backend!");
});

app.listen(port, () => {
  console.log(`Server is running at: ${port}`);
});
