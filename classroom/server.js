const express = require("express");
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
  secret: "mysupersecret", 
  resave: false, 
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());


app.get("/register",(req, res) =>{
  let {name = "anonymous"} = req.query;
  req.session.name = name;
  console.log(req.session.name);
  console.log(req.session);
  if(name === "anonymous"){
    req.flash("error", "user not registered");
  }
  else{
    req.flash("success", "user registered successfully!");}//we cannot see the flash, when we use flash. so we need to do someother thing. We pass it as a message to ejs template.
    res.redirect("/hello");
  });
  
  app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");// you can get the data in messages, when you need access in template 
    res.locals.errorMsg = req.flash("error");
    next();
  });
  
  app.get("/hello",(req, res) =>{
  // console.log(req.flash('success'));
  res.render("page.ejs", {name: req.session.name});
});





// app.get("/reqcount", (req, res)=>{

//   if(req.session.count){
//     req.session.count++;
//   }
//   else{
//     req.session.count = 1;
//   }
//   // req.session.count = 1;
//   res.send(`you sent a request ${req.session.count} times`);
// });


 

app.listen(3000,()=>{
  console.log("Server listening on 3000");
});

// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req,res) => {
//   res.cookie("madeIn","India",{signed: true});
//   res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) =>{
//   console.log(req.signedCookies);
//   res.send("verified");
// });

// // app.get("/getcookies",(req,res)=>{
// //   res.cookie("greet","namasthe");
// //   // res.cookie("madeIn","India",{signed: true});
// //   res.send("sent you some cookies");
// // });

// app.get("/greet",(req,res)=>{
//   let{name="evad ra nuvvu??"} = req.cookies;
//   res.send(`Hi, ${name}`)
// })

// app.use("/users/",users);//we kept "/users" here, so no need to write the users again in the routes defined in user.js
// app.use("/posts/",posts);

// app.get("/",(req,res)=>{
//   console.dir(req.cookies);
//   res.send("Hi, I am root");
// });



