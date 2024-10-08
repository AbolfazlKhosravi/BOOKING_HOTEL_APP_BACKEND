import cors from "cors";
import express from "express";
import "dotenv/config";
import hotelsRoute from "./routes/hotels-route";
import homeRoute from "./routes/home-route";
import bookmarksRoute from "./routes/bookmarks-route";
import errorHandler from "./middlewares/error_Handler";
import  userRoute from "./routes/user-route";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:5173" ,
    credentials:true,
  })
);
app.use("/api", homeRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/bookmarks", bookmarksRoute);
app.use("/api/users",userRoute)
app.use(errorHandler)
const APP_PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT : 3000;
app.listen(APP_PORT, () => {
  console.log(
    "app in running on port " + APP_PORT + " (env: " + process.env.NODE_ENV
  );
});
