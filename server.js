const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors")

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/order");
const paymentRoutes = require("./routes/stripe");

dotenv.config();
app.use(express.json());
app.use(cors());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_URL).then(() => console.log("Database Connected")).catch(error => console.log(error));

const PORT = process.env.PORT || 8000;

app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/checkout", paymentRoutes);


app.get("/", (req, res) => {
    res.send("RESTFULL APIs FOR SHOP")
})

app.listen(PORT, () => {
    console.log(`App is Listening At ${PORT}`)
});