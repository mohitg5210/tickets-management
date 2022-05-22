const jwt = require("jsonwebtoken")
const config = require("../config/config");

function adminAuth (req, res, next) {
    const token = req.header("accessToken");
    if(!token) return res.status(401).json({"message":"no token was found"})
    
    try {
        const decoded = jwt.verify(token, config.secret) 
        if(decoded.userType  === 'Admin' || decoded.userType  === 'Operation Manager') {
            req.user = decoded;
            next();
        } else return res.status(403).json({"message":"Permission denied!"})
    } catch (ex) {
        res.status(401).json({"message":"Invalid token"})
    }
}



function userAuth (req, res, next) {
    const token = req.header("accessToken");
    if(!token) return res.status(401).json({"message":"no token was found"})
    try {
        const decoded = jwt.verify(token, config.secret) 
        if(decoded.userType  === 'Client') {
            req.user = decoded;
            next();
        } else return res.status(403).json({"message":"Permission denied!"})
    } catch (ex) {
        res.status(401).json({"message":"Invalid token"})
    }
}

module.exports = {
    adminAuth,
    userAuth
};

