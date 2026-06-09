import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    const token = req.cookies?.token;

    console.log("🔥 COOKIE IN AUTH MIDDLEWARE:", req.cookies);

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized (no token)" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }

        req.userId = decoded.id;

        console.log("✅ AUTH SUCCESS USER:", req.userId);

        next();
    } catch (err) {
        console.log("❌ JWT ERROR:", err.message);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

export default authUser;