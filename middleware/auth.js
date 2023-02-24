var jwt = require('jsonwebtoken');
const { userModel } = require('../DB/model/user.model');
const auth = () => {
    return async (req, res, next) => {
        try {
            let { token } = req.headers;
            if (token) {
                if (token.startsWith(process.env.AUTHBEARERTOKEN)) {
                    token = token.split(process.env.AUTHBEARERTOKEN)[1];
                    const decoded = await jwt.verify(token, process.env.LOGINTOKEN);
                    if (decoded) {
                        const user = await userModel.findById(decoded.id);
                        req.userId = user._id;
                        next();
                    } else {
                        res.status(400).json({ message: "invalid token" });
                    }

                } else {
                    res.status(400).json({ message: "invalid bearer token" });
                }
            } else {
                res.status(400).json({ message: "missing token" });
            }
        } catch (error) {
            res.status(400).json({ message: "catch error", error });
        }
    }
}
module.exports = auth;