const User = require('../models/userModel');

exports.getSignup = (req,res) => {
    res.render('index');
}

exports.createUser = async (req,res) => {
    //if these don't exist render the index page and show the error message
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


    //otherwise create instance of user
    const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
    });

    //is username already exists
    let isDuplicate = false;

    //save document to database
    //reason gives information of what was caught/ can tell us if duplicate document already exists
    //catch will catch the error
    //user.save is a promise which allows you to use the catch method to do something if there is an error
    await user.save().catch((reason) => {
        console.log(reason)
        //if fail to save to database - catch the reject
        res.render('index', {err: 'A user with this username or password already exists'})
        isDuplicate = true;
        return;
    }); // sends info over to mongoDB database
    // console.log(req)
    // console.log(req.body.userName)
    // console.log(req.body.email)
    //send username over to the profile page

    //catch statement will run if duplicate is true
    if (isDuplicate) {
        return
    }
    res.redirect(`profilepage?userName=${req.body.userName}`);
}

exports.getLogin = (req,res) => {
    res.render('login');
}

exports.postLogin =  async(req,res) => {
    console.log(req.body.userName);
    console.log(req.body.password);

    if (!req.body.userName || !req.body.password) {
    //if none exists render below error
    res.render('login', {err: "Please provide all credentials"});
    return; // return stops rest of the function from working
    }
    // let user = await User.findOne({userName:userName, password:password});


    let user = await User.validateUser(req.body); // will either be false i.e no user or the document 

    //if user is anything other than null, undefined its successful
    if (user) { // success user is return so render the profile page
        console.log(user);
        res.render('profilepage', {user: user.toObject()});
        return;
    }

    //BEFORE
    // if (user == null) {
    //     res.render('login', {err:"please re-enter your details"})
    //     return;
    //     // res.redirect('index');
        
    // }



    //longer version
    // if (user.password == req.body.password) {
    //     res.render('profilepage', {user: user.toObject()});
    //     return;
    // }
    res.render('login', {err:"please re-enter your details"})

    // res.render('profilepage', {user: user.toObject()});
}

exports.getProfile = async(req,res) => {
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
}