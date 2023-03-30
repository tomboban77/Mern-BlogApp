const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const cors = require("cors");
const dotenv = require("dotenv");
const usersRoute = require("./routes/users/usersRoute");
const postRoutes = require("./routes/posts/postRoute");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const commentRoutes = require("./routes/comments/commentRoute");
const emailMsgRoute = require("./routes/email/emailRoute");
const categoryRoute = require("./routes/category/categoryRoute");

dotenv.config();
// require("dotenv").config();

const app = express();

//DB
dbConnect();

//Middleware
app.use(express.json());

//cors
app.use(cors());

//user route
app.use("/api/users", usersRoute);
//post route
app.use("/api/posts", postRoutes);
//comment route
app.use("/api/comments", commentRoutes);

//email route
app.use("/api/email", emailMsgRoute);

//category route
app.use("/api/category", categoryRoute);

// Call error handler below routes
app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
