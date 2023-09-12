//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const findOrCreate = require("mongoose-findorcreate");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//initial configuration for session. remember order of code is important
app.use(session({
    secret: "Our little secret",
    resave:false,
    saveUninitialized:false,
}))

//initializing passport authentication
app.use(passport.initialize());

//ask passport to set up our session
//persistent login sessions
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email:String,
    password:String,
    googleId : String,
    secret : String
});


//this plugin will do the hashing and salting of password
userSchema.plugin(passportLocalMongoose);  
//mongoose-findorcreate package used as plugin
userSchema.plugin(findOrCreate);



const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());  

//serialize and deserialize are used in session only
// serialize creates information of user in cookies
// deserialize crumbles that cookies to discover the data
//edit: we comment out the code, cause this works for only local strategy.
// passport.serializeUser(User.serializeUser());   
// passport.deserializeUser(User.deserializeUser());

//this work for any kind of strategy. 
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    scope:['profile','email' ],
   
  },
  function verify(accessToken, refreshToken, profile, cb) {
    // this fn find or create is not mongoose function also it is a demo 
    //we can say, this means first find the user using findOne if not find
    //create user using the model and save it. or to make it easier we can
    // use a npm package mongoose-findorcreate which works the same as we 
    // did describe above using findOne and creating from model.
    User.findOrCreate({ googleId: profile.id, email:profile.email }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
    res.render("home.ejs");
})


//hit this route when user says sign up with google
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));


//google will callback to this url
app.get('/auth/google/secrets',
    passport.authenticate( 'google', {
        successRedirect: '/secrets',  //authentication successful
        failureRedirect: '/auth/google/failure'     //failed
}));

app.get("/register", function(req, res) {
    res.render("register.ejs");
})

app.get("/login", function(req, res) {
    res.render("login.ejs");
})
// if user abandons the site, and came back again
// if he did not logged out previously we can grant him
// to access secrets directly. this is because of cookies.
// the session ends when browser is closed.
app.get("/secrets", function(req, res) {
    // we are commenting this out, as now this is not a
    // privileged page, anyone can see it logged in or not
    if(req.isAuthenticated()){
        User.find({"secret" :{$ne:null}})
        .then((users)=>{
            res.render("secrets.ejs",{usersWithSecrets: users});
        })
        .catch(err=>console.log(err));
    }else{
        res.redirect("/login");
    }
    // User.find({"secret" :{$ne:null}})
    //     .then((users)=>{
    //         res.render("secrets.ejs",{usersWithSecrets: users});
    //     })
    //     .catch(err=>console.log(err));
})

app.post("/register", function(req, res) {
    User.register({username:req.body.username}, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                // we reach only here when authentication was successful.
                res.redirect("/secrets"); 
                // we are not redirecting, we are rendering so we should have a route /secrets
                // we are creating this so that if user is logged in he can directly access secrets page.
            })
        }
    })
});


app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
            res.redirect("/login");
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
            })
        }
    })
})

// submit page, only if authenticated
app.get("/submit", function(req, res){
    if(req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login");
    }
})

app.post("/submit", async function(req, res){
    const submittedSecret  =req.body.secret;
    // when we login, passport save user details in (req.user)
    //we will save the secret in that user.
    await User.findById(req.user.id)
        .then((user)=>{
            user.secret = submittedSecret;
            user.save();
            res.redirect("/secrets");
        })
        .catch(err =>{
            console.log(err);
        })
})
app.get("/logout", function(req, res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    }); 
    
})

const port =3000;
app.listen(port, function() {
    console.log(`Server is up and running at ${port}`);
});









// LEVEL 2 
// const secretKey = "ThisisourlittleSecret"; 
// //this plugin will use secretKey to encrypt the passwords 
// // if we dont use encryptedFields, it will encrypt every fields.
// //when we save the document it automatically encrypt the field
// // and when we use find based on email, it decrypts the password
// userSchema.plugin(encrypt, {secret:secretKey, encryptedFields:["password"]});


// LEVEL 4
// const bcrypt = require('bcrypt');
// const saltRound = 10; 

// app.post("/register",async function(req, res) {
//     const user = req.body.username;
//     const password = req.body.password;

//    
//     bcrypt.hash(password, saltRound,async function(err,hash){
//         const userData = new User({
//             email : user,
//             password : hash
//         });

//         await userData.save()
//         .then(function(){
//             res.render("secrets.ejs");
//         })
//         .catch((err)=>{
//             console.log("err.message");
//         })
//     })

    
// })

// app.post("/login", async function(req, res){
//     const username = req.body.username;
//     const password = req.body.password;
//     User.findOne({email:req.body.username})
//         .then((docs)=>{
//             if(docs){
//                 bcrypt.compare(password, docs.password, function(err,result){
//                     if(result){
//                         res.render("secrets");
//                     }
//                 })
//             }else
//                 res.send("<h1>Incorrect password</h1>" );
//         })
//         .catch((err)=>{
//             console.log("Errors");
//         })
// })
