const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SEC_KEY, (error, user)=>{
            if(error) res.status(403).json("Token Is Not Valid");
            req.user = user;
            next();
        });
    } else{
        return res.status(401).json("You Are Not Authenticated");
    }
};

const verifyTokenAndAuth = (req,res,next) =>{
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else{
            return res.status(403).json("You Are Not Allowd To Do This ");
        }
    })
}

const verifyTokenAndAdmin = (req,res,next) =>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next();
        } else{
            return res.status(403).json("You Are Not Allowd To Do This ");
        }
    })
}

module.exports = {verifyToken , verifyTokenAndAuth, verifyTokenAndAdmin};