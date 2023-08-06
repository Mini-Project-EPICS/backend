

const scholarship_collection = require("../db/scholarship_details");
const authMiddleware = async (req, res, next) => {
    try {
        console.log("req.session.user:", req.session.user);

        if (req.session && req.session.user && req.session.user.email) {
            req.user = req.session.user;

            const loggedInOrganizerEmail = req.user.email;
            const scholarships = await scholarship_collection.find({
                email: loggedInOrganizerEmail,
            });

            req.scholarshipsAdded = scholarships.length > 0;
        } else {
            req.scholarshipsAdded = false;
        }

        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.send("Error in authentication middleware");
    }
};

module.exports = authMiddleware;

 