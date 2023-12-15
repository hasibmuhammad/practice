import { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

// middleware
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to practice backend!");
});

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.er9gvke.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Create middleware
const verifyToken = async (req, res, next) => {
  const { token } = await req.cookies;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access!" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized Access!" });
    }

    req.user = decoded;

    next();
  });
};

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // create collection under db
    const prodCollection = client.db("practiceDB").collection("prods");

    // jwt
    app.post("/jwt", async (req, res) => {
      const user = await req.body;

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
        })
        .send({ success: true });
    });

    // add product
    app.post("/add", verifyToken, async (req, res) => {
      const user = await req.user;
      const product = await req.body;

      if (user.email !== product.email) {
        res.status(403).send({ message: "Forbidden Access!" });
      }

      const result = await prodCollection.insertOne(product);

      res.send(result);

      // console.log(product);
    });

    // Get all products
    app.get("/products", verifyToken, async (req, res) => {
      const email = req.query.email;

      if (req.user.email !== email)
        return res.status(403).send({ message: "Forbidden Access" });

      const query = { email };
      const products = await prodCollection.find(query).toArray();

      res.send(products);
    });

    // Upon Logout clear the cookies
    app.get("/logout", async (req, res) => {
      res.clearCookie("token").send("Cookie Cleared!");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at: ${port}`);
});
