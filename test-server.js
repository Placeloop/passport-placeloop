const express = require('express')
const app = express()
const port = 3042
const passport = require('passport');
const PlaceloopStrategy = require('./lib/strategy')

// app.use(express.static('public'));
// app.use(express.session({ secret: 'keyboard cat' }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(app.router);

passport.use(new PlaceloopStrategy({
    clientID: "passportjs2363d58f8fc5a727abc9ec75bd1c0d8abce79c0af983bd505d349ab2975f80b827097864431743b3901c2426b9cfb15cac078672e3abf059cc1a5a3",
    clientSecret: "passport354b93804a535826fff3a0a150f036185f39e253b8500afcd9fae0b6d32c92952ac54fae99bb22a64afcb5ed3d91cae08cb6a01cde315978f912dbb38c4ec37e567c447d65df347ea8297354fe6c3d622dd3618d192ac34bb4f0420473405f1854bdc92c7918ae23686661499c2d0befd5d9786f8aa92c1ffc9abc95889067b6",
    callbackURL: "http://localhost:3042/oauth2/callback"
}, function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    console.log('Successfully logged by Placeloop Strategy');
    console.log("[41m🚀 GOGSON[0m ~ profile", profile)
    return done(undefined, profile);
  }
));

app.get('/login', passport.authenticate('placeloop'));

app.get('/oauth2/callback', 
    passport.authenticate('placeloop', { failureRedirect: '/' }),
    (req, res) => {
    res.send(req.session.passport.user.accessToken)
})

app.get('/', (req, res) => {
    res.send('<a href="/login">Login with Placeloop</a>')
})

app.get('/profile', function(req, res) {
    res.send('Logged in !');
});

app.get('/error', function(req, res) {
    res.send('Oops ! You can retry to <a href="/login">Login with Placeloop</a> ');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
