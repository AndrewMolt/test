
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {ObjectId} = require('mongodb');
const {MongoClient} = require('mongodb');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connecting to mongo db
mongoose.connect("mongodb+srv://andrumolt:test123@cluster0.jlchpmi.mongodb.net/accounts");

//this is how accounts are setup via the database
const accountsSchema = {
  accountnum : String,
  accountpassword: String,
  balance: String,
  routingnum: String,
  directdepositnum: String,
  wiretransfernum: String
};


const Account = mongoose.model("account", accountsSchema);


//checks passwords and returns true if login credentials are correct, returns false if not
function checkPasswords(testnum, testpass)
{

  if(testnum == "1234567890")
  {
    if(testpass == "password")
    {
      return true;
    } else {
      return false;
    }
  } else if(testnum == "132161597")
  {
    if(testpass == "password")
    {
      return true;
    }
    else {
      return false;
    }
  } else if(testnum == "343726692")
  {
    if(testpass == "password")
    {
      return true;
    }
    else {
      return false;
    }
  } else if (testnum == "740013224")
  {
    if(testpass == "password")
    {
      return true;
    }
    else {
      return false;
    }
  } else {
    return false;
  }

}



//updates the account dashboard page with the account number given on valid login
async function updateDashboard (accountnumber)
{
  const newAccount = await Account.findOne({accountnum: accountnumber}, "accountnum accountpassword balance routingnum directdepositnum wiretransfernum");
  newAccount.toObject({getters: true});
  return newAccount;
}



//reroutes to account dashboard on correct login credentials
app.post("/login", function(req, res)
{
  const attemptNumber = req.body.loginEmail;
  const attemptPassword = req.body.loginPassword;
  if(checkPasswords(attemptNumber, attemptPassword))
  {
    updateDashboard(attemptNumber).then( result => {
      const newAccount = result;
      res.render("accountdashboard", {account: newAccount});
    });
  } else {
    res.redirect("/");
  }
})



//reroutes to login page
app.post("/logout", function(req, res)
{
  res.render("loginpage");
})



//starting page
app.get("/", function(req, res)
{
  res.render("loginpage");

})


app.listen(3000, function() {
  console.log("Server started succesfully via localhost.");
});
