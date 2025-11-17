import rateLimit from "express-rate-limit";

export const authLimitter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: "Too many attemplets",
    handler: (req, res, next, options) => {
        if (!req.rateLimit) return next();

        const remainingAttempts =
            Math.max(req.rateLimit.limit - req.rateLimit.current, 0);


        res.status(429).json({
            success: false,
            message: "Too many attempts, try again later.",
            maxAttempts: options.max,
            remainingAttempts,
        });
    },
})
