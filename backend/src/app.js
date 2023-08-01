

const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const student_collection = require("./db/student_conn")
const organiser_collection = require("./db/organiser_conn")
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

// app.post("/register", async (req, res) => {
//     const signup_data = {
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//     };

//     await student_collection.insertMany([signup_data]);

//     res.render("home");
// });


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


// app.post("/login", async (req, res) => {
//     try {
//         const check = await student_collection.findOne({ email: req.body.email });

//         if (check.password === req.body.password) {
//             res.render("home");
//         } else {
//             res.send("Incorrect Password");
//         }
//     } catch {
//         res.send("No account with that email found");
//     }
// });

// app.post("/login", async (req, res) => {
//     const userType = req.body.userType; // Get the selected user type (student or organizer)

//     if (userType === "student") {
//         try {
//             const student = await student_collection.findOne({ email: req.body.email });

//             if (student && student.password === req.body.password) {
//                 res.render("home");
//             } else {
//                 res.send("Incorrect Student Email or Password");
//             }
//         } catch {
//             res.send("No student account with that email found");
//         }
//     } else if (userType === "organizer") {
//         try {
//             const organizer = await organizer_collection.findOne({ email: req.body.email });

//             if (organizer && organizer.password === req.body.password) {
//                 res.render("home");
//             } else {

//                 res.send("Incorrect Organizer Email or Password");
//             }
//         } catch {
//             console.error("Error finding organizer:", error);
//             res.send("No organizer account with that email found");
//         }
//     } else {
//         res.send("Invalid user type");
//     }
// });

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


app.get("/logout", (req, res) => {
    // Perform any logout logic (e.g., clear session, cookies, etc.) if needed

    res.render("logout");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
