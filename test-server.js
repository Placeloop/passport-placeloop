const express = require('express')
const app = express()
const port = 3042
const passport = require('passport');
var session = require("express-session");
const placeloopStrategy = require('./lib/strategy')

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
///// Init
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });

app.use(express.static('public'));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
 }));
app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
///// Configure placeloop strategy with development/local URIs
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

passport.use(new placeloopStrategy({
    clientID: "passportjs2363d58f8fc5a727abc9ec75bd1c0d8abce79c0af983bd505d349ab2975f80b827097864431743b3901c2426b9cfb15cac078672e3abf059cc1a5a3",
    clientSecret: "passport354b93804a535826fff3a0a150f036185f39e253b8500afcd9fae0b6d32c92952ac54fae99bb22a64afcb5ed3d91cae08cb6a01cde315978f912dbb38c4ec37e567c447d65df347ea8297354fe6c3d622dd3618d192ac34bb4f0420473405f1854bdc92c7918ae23686661499c2d0befd5d9786f8aa92c1ffc9abc95889067b6",
    callbackURL: "http://localhost:3042/oauth2/callback",
    authorizationURL: 'https://merchant.placeloop.vm/ysnpm-middleware/merchant/oauth2/authorize',
    tokenURL: 'https://merchant.placeloop.vm/ysnpm-middleware/merchant/oauth2/token',
    profileURL: 'https://merchant.placeloop.vm/api/v1/auth/merchant/state/current'
}, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
///// Routes
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

// Start handshake
app.get('/login', passport.authenticate('placeloop'));

// Handshake callback
app.get('/oauth2/callback',
    passport.authenticate('placeloop', { failureRedirect: '/error' }),
    (req, res) => {
    return res.redirect('/profile');
})

// Project homepage
app.get('/', (req, res) => {
    res.send('<a href="/login">Login with Placeloop</a> - <a href="/profile">Mon compte</a>')
})

// Protected user page
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/error');
    const page = 
        '<h1>Welcome '+req.user.email+' !</h1>' +
        '<a href="/logout">Logout</a> <pre style="background-color:#efefef">' + 
        JSON.stringify(req.user, undefined, '\t')+
        '</pre>';
    res.send(page);
});

// Error page
app.get('/error', function(req, res) {
    const page = 
        '<h1>Restricted access</h1>' +
        '<br/>Please <a href="/login">login with Placeloop</a> '+
        'before accessing this page.';
    res.send(page);
});

// Logout page
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

// 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  

// Error handler
app.use(function(err, req, res, next) {
    res.send('<h1>Error</h1> ' + err)
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
