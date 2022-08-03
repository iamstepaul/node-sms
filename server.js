const express = require("express");
const expresshandlebars = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const userStore = require("connect-mongo")(session);
const path = require("path");
const app = express();
const port = 3000;

//=================setting up logger to keep track of the logs=============
app.use(logger("dev"));
//=======setting up the database configuration==================
mongoose.promise = global.Promise;
const MONGO_URL = require("./config/db").MONGOURL;

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    config: { autoIndex: false }
  })
  .then(() => {
    console.log(`database conncted successfully at ${MONGO_URL}`);
  })
  .catch(err => {
    console.log(`database not connected succesfully ${err.message}`);
  });
// =================setting up bodyParser=============
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "meesh",
    resave: false,
    saveUninitialized: false,
    user: new userStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 180 * 60 * 1000
    }
  })
);

//==========setting up flash and other environmental variables==========

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success");
  res.locals.error_messages = req.flash("error");
  res.locals.user = req.user ? true : false;
  res.locals.session = req.session;
  next();
});
//=============setting up the template engine=============
app.engine(
  ".hbs",
  expresshandlebars({
    defaultLayout: "layout",
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");
// app.use('view', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, "public")));

//====================route grouping=================
const defaultRoutes = require("./routes/defaultRoute");
const userRoutes = require("./routes/userRoute");

app.use("/", defaultRoutes);
app.use("/user", userRoutes);

//================server listening================
app.listen(port, (req, res) => {
  console.log(`the server started at port ${port}...`);
});
