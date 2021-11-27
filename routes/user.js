const { verifyTokenAndAuth , verifyTokenAndAdmin} = require("../middleware/verifyToken");

const router = require("express").Router();

// Update User 
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        const updatedUSer = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        });
        res.status(200).json(updatedUSer);
    } catch (error) {
        res.status(500).json(error);
    }
});

// delete user
router.delete("/:id", verifyTokenAndAuth ,async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User Deleted Successfully");

    } catch (error) {
        res.status(500).json(error);
    }
});

// get user 
router.get("/find/:id", verifyTokenAndAdmin ,async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password , ...others } = user._doc;
        res.status(200).json(others);

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;