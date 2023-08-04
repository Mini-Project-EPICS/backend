

const express = require("express");
const session = require("express-session"); 
const path = require("path");
const app = express();
const hbs = require("hbs");
const student_collection = require("./db/student_conn")
const organiser_collection = require("./db/organiser_conn")
const scholarship_collection = require("./db/scholarship_details");
const authMiddleware = require("./middlewares/auth");
const { error } = require("console");

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "../public")));
const views_path = path.join(__dirname, "../views");
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(__dirname, "../views/images"));
app.use(express.json())
app.set("view engine", "hbs");
app.set("views", views_path);




app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
 
    res.render("login");
});


app.get("/register", (req, res) => {
    res.render("register");
});





app.use(
    session({
      secret: "your_session_secret_here", // Replace with your session secret
      resave: false,
      saveUninitialized: true,
    })
  );
  
  app.use(authMiddleware); 


// Use the authentication middleware for the /scholarships route
// app.js
// Use the authentication middleware for the /scholarships route
app.get("/scholarships", authMiddleware, async (req, res) => {
    try {
      // If the logged-in organizer has not added any scholarships, render the page with an empty array
      if (!req.scholarshipsAdded) {
        return res.render("scholarships", { scholarships: [] });
      }
  
      // If the logged-in organizer has added scholarships, fetch and render them
      const loggedInOrganizerEmail = req.user.email;
      const scholarships = await scholarship_collection.find({
        email: loggedInOrganizerEmail,
      });
  
      res.render("scholarships", { scholarships });
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      res.send("Error fetching scholarships");
    }
  });
  

app.post("/register", async (req, res) => {
    const signup_data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    const userType = req.body.userType; // Get the selected user type (student or organizer)

    if (userType === "student") {
        try {
            const student = new student_collection(signup_data);
            await student.save();
            res.render("home");
        } catch (error) {
            res.send("Error registering student");
        }
    } else if (userType === "organizer") {
        try {
            const organizer = new organiser_collection(signup_data);
            await organizer.save();
            res.render("home");
        } catch (error) {
            res.send("Error registering organizer");
        }
    } else {
        res.send("Invalid user type");
    }
});


app.post("/login", async (req, res) => {
    const userType = req.body.userType; // Get the selected user type (student or organizer)

    if (userType === "student") {
        try {
            const student = await student_collection.findOne({ email: req.body.email });

            if (student && student.password === req.body.password) {
                res.render("home-stu");
            } else {
                res.send("Incorrect Student Email or Password");
            }
        } catch (error) {
            console.error("Error finding student:", error);
            res.send("No student account with that email found");
        }
    } else if (userType === "organizer") {
        try {
            const organizer = await organiser_collection.findOne({ email: req.body.email });

            if (organizer && organizer.password === req.body.password) {
                
                req.session.user = {
                    email: req.body.email,
                    userType: "organizer",
                    // Add other organizer-related information if needed
                  };

                res.render("home-org");
            } else {
                res.send("Incorrect Organizer Email or Password");
            }
        } catch (error) {
            console.error("Error finding organizer:", error);
            res.send("No organizer account with that email found");
        }
    } else {
        res.send("Invalid user type");
    }
});




  
app.post("/add-scholarship", authMiddleware, async (req, res) => {
  try {
    // Get the email of the logged-in organizer from the session
    const loggedInOrganizerEmail = req.session.user.email;

    // Extract scholarship details from the form submission
    const scholarshipData = {
      title: req.body.title,
      description: req.body.description,
      amount: req.body.amount,
      email: loggedInOrganizerEmail, // Add the email field with the organizer's email
      // Add other scholarship details here
    };

    // Create a new scholarship document and save it to the database
    const scholarship = new scholarship_collection(scholarshipData);
    await scholarship.save();

    // Redirect the organizer back to the "Scholarships" page after adding a scholarship
    res.redirect("/scholarships");
  } catch (error) {
    console.error("Error adding scholarship:", error);
    res.send("Error adding scholarship");
  }
});


  


app.get("/logout", (req, res) => {
    // Perform any logout logic (e.g., clear session, cookies, etc.) if needed

    res.render("logout");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
