const HttpError = require("./models/Http-error");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const usersRoutes = require("./routes/users");
const stageRoutes = require("./routes/stage");
const planningRoutes = require("./routes/planning");
const juryRoutes = require("./routes/jury");
const conversationRoutes = require("./routes/conversationRoutes");
const enseignantRoutes = require("./routes/enseignantRoutes");
const studentsRoutes = require("./routes/students");
const { checkToken } = require("./middlware/jwt");
const filiereRoutes = require("./routes/filiereRoutes");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });

const stage = require("./models/stage");
const fs = require("fs");
const path = require("path");
const upload = require("express-fileupload");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(
  "/uploads/docsAdmin",
  express.static(path.join("uploads", "docsAdmin"))
);

app.use(cookieParser());

app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", checkToken, usersRoutes);
app.use("/api/stages", checkToken, stageRoutes);
app.use("/api/conversation", checkToken, conversationRoutes);
app.use("/api/enseignant", checkToken, enseignantRoutes);

app.use("/api/affectation", checkToken, juryRoutes);

app.use("/api/planning", checkToken, planningRoutes);

app.use("/api/students", checkToken, studentsRoutes);
app.use("/api/filieres", checkToken, filiereRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      return next(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASSWORD +
      "@cluster0-shard-00-00.16mk3.mongodb.net:27017,cluster0-shard-00-01.16mk3.mongodb.net:27017,cluster0-shard-00-02.16mk3.mongodb.net:27017/" +
      process.env.DB_NAME +
      "?ssl=true&replicaSet=atlas-8xtjxf-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("-----------------------\n server up and runing !!!");
  })
  .catch((err) => {
    console.log(err);
  });
