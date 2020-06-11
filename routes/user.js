const {Router} = require('express');
const router = Router();


const userController = require('../controllers/userController')


//replaced app with router
router.get('/', userController.getSignup);


//when signup is successful will get redirected to profilepage
router.post('/', userController.createUser);


router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

    /* JUST QUERYING DATABASE - NOT PUTTING USER INTO THE DB
    get user information - username and passowrd from the form /
    check if username and password were retrieved -if not have error to say missing something
    find model method / 
    findoNE - if statement if username and password match found data e.g
    SEARCH DB FOR THE GIVEN USERNAME /
    WITH THE RESULT FROM THE DB CHECK IF PASSWORDS MATCH
    IF MATCH GO TO PROFILE PAGE
    ELSE GO BACK TO LOGIN PAGE WITH ERR
    */


router.get('/profilepage', userController.getProfile);







module.exports = router;