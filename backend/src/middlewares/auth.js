// authMiddleware.js
const authMiddleware = async (req, res, next) => {
    try {
      console.log("req.session.user:", req.session.user)
      // Check if the user is authenticated and the session contains user data
      if (req.session && req.session.user) {
        // If the user is authenticated, attach the user data to the request object
        req.user = req.session.user;
  
        // Check if the logged-in organizer has added any scholarships
        const loggedInOrganizerEmail = req.user.email;
        const scholarships = await scholarship_collection.find({
          email: loggedInOrganizerEmail,
        });
  
        // Set a flag in the request object to indicate if the user has added scholarships
        req.scholarshipsAdded = scholarships.length > 0;
      } else {
        // If the user is not authenticated, set the flag to false
        req.scholarshipsAdded = false;
      }
  
      // Proceed to the next middleware or route handler
      next();
      console.log("req.session.user:", req.session.user);

    } catch (error) {
      // Handle any errors that may occur during the middleware execution
      console.error("Error in authMiddleware:", error);
      res.send("Error in authentication middleware");
    }
  };
  
  module.exports = authMiddleware;
  