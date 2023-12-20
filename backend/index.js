import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

// middleware
app.use(
  cors({
    origin: ["https://practice-25239.web.app", "http://localhost:5173"],
    credentials: true,
  })
);
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

    // cllections under db
    const prodCollection = client.db("practiceDB").collection("prods");
    const cartCollection = client.db("practiceDB").collection("cart");

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
          // sameSite: "none",
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
      const currentPage = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      console.log(currentPage, size);

      if (req.user.email !== email)
        return res.status(403).send({ message: "Forbidden Access" });

      const query = { email };
      const products = await prodCollection
        .find(query)
        .skip(currentPage * size)
        .limit(size)
        .toArray();
      const count = await prodCollection.countDocuments(query);

      res.send({ products, count });
    });

    // Upon Logout clear the cookies
    app.get("/logout", async (req, res) => {
      res.clearCookie("token").send("Cookie Cleared!");
    });

    // Cart
    app.post("/addtocart", verifyToken, async (req, res) => {
      const { newCart } = await req.body;
      const email = req.query.email;
      if (req.user.email !== email) {
        return res.status(403).send({ message: "Forbidden Access" });
      }

      // setting the id to the objectid for mongodb
      newCart._id = new ObjectId(newCart._id);

      // find the product in the cartcollection by the id
      const cartRes = await cartCollection.findOne({ _id: newCart._id });
      if (!cartRes) {
        // Not in the cart
        const result = await cartCollection.insertOne(newCart);

        res.send(result);
      } else {
        // Already in the cart
        const update = await cartCollection.updateOne(
          { _id: cartRes._id },
          { $set: { quantity: cartRes.quantity + 1 } },
          { upsert: false }
        );

        res.send(update);
      }
    });

    // get cart
    app.get("/cart", verifyToken, async (req, res) => {
      const email = req.query.email;

      if (email !== req.user.email) {
        return res.status(403).send({ message: "Forbidden Access" });
      }

      const result = await cartCollection.find({ email }).toArray();

      // res.send(result);

      // console.log(result);

      let cartProducts = [];
      for (let i = 0; i < result.length; i++) {
        let cartItem = result[i];
        let cartId = cartItem._id;
        let cartQty = cartItem.quantity;

        // Fetch the product by id
        let prod = prodCollection
          .find({ _id: cartId })
          .project({ _id: 0, name: 1, url: 1, price: 1, description: 1 });

        for await (const doc of prod) {
          doc._id = cartId;
          doc.quantity = cartQty;

          cartProducts.push(doc);
        }
      }

      res.send(cartProducts);
    });

    // get product by id

    // app.get("/productbyid", verifyToken, async (req, res) => {
    //   const email = req.query.email;

    //   if (email !== req.user.email) {
    //     return res.status(403).send({ message: "Forbidden Access" });
    //   }
    // });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at: ${port}`);
});
