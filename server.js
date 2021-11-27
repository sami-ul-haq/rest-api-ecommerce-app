const express = require("express");
const app = express();
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

dotenv.config();
app.use(express.json());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_URL).then(() => console.log("Database Connected")).catch(error => console.log(error));

const PORT = process.env.PORT || 8000;

app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
    res.send("RESTFULL APIs FOR SHOP")
})

app.listen(PORT, () => {
    console.log(`App is Listening At ${PORT}`)
});