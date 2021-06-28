//packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

//express
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/hospitalsDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true, useUnifiedTopology: true});

//home page route
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

//logIn route
app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/login.html");
})

//logIn post route
app.post("/", function(req, res) {

  const email = req.body.email;
  const pass = req.body.password;

  if(email === "admin@abc.com" && pass === "1234")
  {
    //console.log("Success!");
    res.sendFile(__dirname + "/admin.html");
  }

  else {
    res.sendFile(__dirname + "/login-fail.html")
    //console.log("Failure!");
  }
});

app.get("/form", function(req, res) {
  res.sendFile(__dirname + "/public/form-new.html");
});




//hospital Database

const hospitalSchema = {
  name: String,
  address: String,
  phone: String
};

const Hospital = mongoose.model("Hospital", hospitalSchema);

const h1 = new Hospital({
  name: "Medanta Hospital",
  address: "Sector–38,122 001, Gurgaon, Haryana",
  phone: "1234567890"
});

const h2 = new Hospital({
  name: "Max Hospital",
  address: "1, 2, Press Enclave Marg, Saket Institutional Area, Saket, New Delhi, Delhi 110017",
  phone: "1234567890"
});

const h3 = new Hospital({
  name: "Apollo Hospital",
  address: "North Block, Central Secretariat, New Delhi",
  phone: "1234567890"
});

const h4 = new Hospital({
  name: "Gangaram Hospital",
  address: "Rajender Nagar, New Delhi",
  phone: "1234567890"
});

const h5 = new Hospital({
  name: "Fortis Hospital",
  address: "Gurgaon, New Delhi",
  phone: "1234567890"
});


const defaultItems = [h1, h2, h3, h4, h5];


app.get("/hospitalDB", function(req, res) {

    Hospital.find({}, function(err, foundItems){

      if(foundItems.length === 0)
      {
        Hospital.insertMany(defaultItems, function(err){
          if(err){
            console.log(err);
          }
          else {
            console.log("Added Default Hospitals!");
          }
        });

        res.redirect("db");

      } else {
        res.render("db", {hospitals: defaultItems});
      }

    });

});

app.get("/addHospital", function(req, res) {
  res.render("index");
});

app.get("/appointment", function(req, res) {
  res.sendFile(__dirname + "/appointment.html");
});

app.get("/payment", function(req, res) {
  res.sendFile(__dirname + "/Payment.html");
});

app.post("/addHospital", function(req, res) {

  const nameInput = _.capitalize(req.body.hname);
  const addressInput = _.capitalize(req.body.haddress);
  const phoneInput = req.body.hphone;

  const newHospital = new Hospital({
    name: nameInput,
    address: addressInput,
    phone: phoneInput
  });

  defaultItems.push(newHospital);

  newHospital.save();


  res.render("db", {hospitals: defaultItems});
  //console.log(req);
});


app.post("/hospitalDB", function(req, res) {

  res.render("db", {hospitals: defaultItems});
  //console.log(req);
});



//users Database
const userSchema = {
  fname: String,
  lname: String,
  city: String,
  phone: String,
  email: String,
};

const User = mongoose.model("User", userSchema);

const u1 = new User({
  fname: "Ridham",
  lname: "Jain",
  city: "Delhi",
  phone: "1234567890",
  email: "ridham@abc.com",
});

const u2 = new User({
  fname: "Riya",
  lname: "Dev Varshney",
  city: "Mumbai",
  phone: "1234567890",
  email: "riya@abc.com",
});

const u3 = new User({
  fname: "Garvit",
  lname: "Gulati",
  city: "Bangalore",
  phone: "1234567890",
  email: "garvit@abc.com",
});

const defaultUsers = [u1, u2, u3];

app.get("/userDB", function(req, res) {

    User.find({}, function(err, foundItems){

      if(foundItems.length === 0)
      {
        User.insertMany(defaultUsers, function(err){
          if(err){
            console.log(err);
          }
          else {
            console.log("Added Default Users!");
          }
        });

        res.redirect("userdb");

      } else {
        res.render("userdb", {users: defaultUsers});
      }

    });

});

app.get("/addUser", function(req, res) {
  res.sendFile(__dirname + "/public/form-new.html");
});

app.post("/addUser", function(req, res) {

  const fname = _.capitalize(req.body.fname);
  const lname = _.capitalize(req.body.lname);

  const city = _.capitalize(req.body.city);
  const state = _.capitalize(req.body.state);
  const zip = req.body.zip;

  const phone = req.body.phone;
  const email = req.body.email;

  var d = new Date();
  const currentYear = d.getFullYear();;
  const age = currentYear - req.body.year;

  var bloodGroup = req.body.blood;

  var gender = req.body.gender;

  if(gender === '1')
  gender = 'Male';

  else if(gender === '2')
  gender = 'Female';

  else
  gender = 'Other';

  const rcvdDose = req.body.rcvdDose;
  const covidPositive = req.body.covidPositive;
  const pregnantOrbreastfeeding = req.body.pregnantOrbreastfeeding;
  const allergic = req.body.allergic;

  const userInfo = {
    age: age,
    gender: gender,
    city: city,
    state: state,
    zip: zip,
    bloodGroup: bloodGroup,
    recievedDose: rcvdDose,
    covidPositive: covidPositive,
    pregnantOrbreastfeeding: pregnantOrbreastfeeding,
    allergic: allergic
  };

  console.log(userInfo);





  const newUser = new User({
    fname: fname,
    lname: lname,
    city: city,
    phone: phone,
    email: email,
  });

  //console.log(newUser);

  defaultUsers.push(newUser);

  newUser.save();
});


//hospitals & clinics list
app.get("/hospitals", function(req, res) {
  Hospital.find({}, function(err, foundItems){

    if(foundItems.length === 0)
    {
      Hospital.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }
        else {
          //console.log("Added Default Hospitals!");
        }
      });

      res.redirect("hosp");

    } else {
      res.render("hosp", {hospitals: defaultItems});
    }

  });
});



//listening Server
// app.listen(3000, function() {
//   console.log("server started on port 3000");
// });

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running...")); 
