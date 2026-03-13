import jwt from "jsonwebtoken";

// export const auth = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token)
//         return res.status(401).json({ msg: "Unauthorized" })

//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decode;
//     next();
// }

export const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification failed:", error.message);
        res.status(401).json({ msg: "Invalid token" });
    }
};
