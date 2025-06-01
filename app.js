const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//for boiler plate we use this
const ExpressError = require("./utils/ExpressError.js");
// const {reviewSchema} = require("./models/review.js");
const Review = require("./models/review.js");


//routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const session = require("express-session");
const flash = require("connect-flash");
const port = 9903;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("._method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret : "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //days * hours * minutes * seconds * milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,

  }, 
};


main().then(()=>{//this is function call for the main() function below this
  console.log("Connected to wanderlust");
})
.catch((err)=>{console.log("Not connected wanderlust");});

async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.listen(port,()=>{
  console.log(`Hey, I am listening on ${port}`);
});


app.get("/",(req,res)=>{
  res.send("Hey, I am root");
});



app.use(session(sessionOptions));//to cross check whether you have implemented it correctly or not, you can run the code and open a route in your application and check for cookie(inspect> application> cookie)
app.use(flash());



//The next lines are for authentication - every line had passport written init in oneplace or the other
//The passport uses "session", so we need to write the passport intialize under the session middleware
app.use(passport.initialize());
app.use(passport.session());//gives the ability to identify users when navigating through different pages. 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//when a user has logged in, then to store information about the user
passport.deserializeUser(User.deserializeUser());// to the unstore the information about the user.



app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async(req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "gopichand"//though we wrote only email in the schema. We can also write username here, because passport directly generates the username
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld!");//this stores the user, with the given password("helloworld!") in the database. It checks if the username is unique or not

//   res.send(registeredUser);

// });

app.use("/listings",listingRouter);//all routes are in listing.js in routes folder gets "/listings" as a prefix;
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"} = err;
  res.status(statusCode).render("listings/error.ejs",{message});
  // res.status(statusCode).send(message);
})

