const {
    verifyToken,
    verifyTokenAndAuth,
    verifyTokenAndAdmin
} = require("../middleware/verifyToken");

const router = require("express").Router();
const Order = require("../models/Order");

// create order
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }

});

// update order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndupdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

// delete order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order Has Been Cancelled");
    } catch (error) {
        res.status(500).json(error);
    }
});

// get user order
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Order.find({
            userId: req.params.userId
        });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get all order
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get monthly
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const PreviousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([{
            $match: {
                createdAt: {
                    $gte: PreviousMonth
                }
            }
        },
        {
            $project: {
                month: { $month: "$createdAt" },
                sales: "$amount"
            },
        },
        {
            $group: {
                _id: "$month",
                total: { $sales: "$sales" }
            }
        }

        ])
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;