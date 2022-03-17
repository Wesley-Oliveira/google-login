import express from 'express'
import session from 'express-session'
import passport from 'passport'
import 'dotenv/config'

/*  EXPRESS */
const app = express();

app.set('view engine', 'ejs');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.get('/', function (req, res) {
    res.render('pages/auth');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));


/*  PASSPORT SETUP  */
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.get('/success', (req, res) => {
    res.send(userProfile)
})
app.get('/error', (req, res) => {
    res.send("error logging in")
})

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


/*  Google AUTH  */
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.URL;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: REDIRECT_URL,
},
    function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
    function (req, res) {
        console.log('send to google login')
    }
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        // Successful authentication, redirect success.
        res.redirect('/success');
    });