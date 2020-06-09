const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
// const fetch = require("node-fetch");
const fs = require('file-system');
const mongoose = require('mongoose'); //lets us use schemas

const User = require('./models/userModel');

mongoose.connect('mongodb+srv://Emma:password999@usersignup-6yj6w.mongodb.net/UserSignup?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

//telling express to use bodyparser and have static path for the front end of public folder
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()); //easier to access object in this format & allows us to use req.body to access information from a form
app.use(express.static(path.join(__dirname, 'public')));

//sets up template engine for application
app.engine('.hbs', hbs ({
    defaultLayout: 'layout',
    extname: 'hbs'
}));

app.set('view engine', '.hbs');

app.get('/', (req,res) => {
    res.render('index');
})

//when signup is successful will get redirected to profilepage
app.post('/', async (req,res) => {
    if (!req.body.userName || !req.body.email || !req.body.password) {
        //if none exists render below error
        res.render('index', {err: "Please provide all credentials"});
        return;
    }
    /* connection issues:
        not valid email
        unable to link to database
        user missed one of the fields
        duplicate users */


    //create instance of user
    let user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
    });

    let isDuplicate = false;

    await user.save().catch((reason) => {
        // console.log(reason)
        //if fail to save to database
        res.render('index', {err: 'A user with this username or password already exists'})
        isDuplicate = true;
        return;
    }); // sends info over to mongoDB database
    // console.log(req)
    // console.log(req.body.userName)
    // console.log(req.body.email)
    //send username over to the profile page
    if (isDuplicate) {
        return
    }
    res.redirect(`profilepage?userName=${req.body.userName}`);
})

app.get('/login', (req,res) => {
    res.render('login');
})


// app.post('/login', async(req,res) => {
//     let email = req.body.email;
//     let password = req.body.password;
//     res.render("login");
// })




app.get('/profilepage', async(req,res) => {
    //findOne will just bring one object back
    //then pass username as whats entered in the form
    let user = await User.findOne({userName:req.query.userName});
    // let pics = fs.readdirSync(__dirname + '/public/images');
    // res.render('profilepage', {pics});
    // res.render('profilepage', {userName: req.query.userName});

    //if cant find record in database 'null'
    if (user == null) {
        res.render('profilepage', {err: "that user doesn't exist"})
        return;
    }
    console.log(user)
    //using the method from the schema to return the user data as an object so it can be displayed in handlebars
    res.render('profilepage', {user: user.toObject()});
})

app.listen(3004, () => {
    console.log("you are listening on port 3004")
})