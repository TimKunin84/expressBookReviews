const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        // Retrieve the token from session storage
        let token = req.session.authorization['accessToken'];

        // Verify the token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;  // Attach user info to the request object
                next();  // Proceed to the next middleware/route handler
            } else {
                return res.status(403).json({ message: "User not authenticated. Invalid token." });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in. Please log in to access this resource." });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
