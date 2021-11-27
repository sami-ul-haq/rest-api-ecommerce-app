const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    });

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        console.log(error);
    }

});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong Credentials Username");

        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const origPassword = hashedPass.toString(CryptoJS.enc.Utf8);

        origPassword !== req.body.password && res.status(401).json("Wrong Credentials Password");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.SEC_KEY, {
            expiresIn: "3d"
        });

        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken});

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;