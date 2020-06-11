const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
// const fetch = require("node-fetch");
const fs = require('file-system');
const mongoose = require('mongoose'); //lets us use schemas

const userRouter = require('./routes/user');

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

app.use('/', userRouter);

app.listen(3000, () => {
    console.log("you are listening on port 3000")
})