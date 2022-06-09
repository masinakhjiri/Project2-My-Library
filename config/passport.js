const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/user')


// new code below
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile)
    User.findOne({'googleId':profile.id},function(err,user){
      //console.log('before error')
      if(err) return cb(err)
       //console.log('after error')

      if(user){
        //console.log('user exists')
        return cb(null,user)
      }else{
        const newUser = createNewUser(profile)
        newUser.save(function(err){
          if(err) return cb(err)
          return cb(null,newUser)
        })

      }

    })
    
    }
));

function createNewUser(profile){
   return new User({
    googleId : profile.id,
    name : profile.displayName,
    email:profile.email,
    isAdmin:false
  })

}

passport.serializeUser(function(user, done) {
  return done(null,user)

    
});

passport.deserializeUser(function(user, done) {
  return done(null,user)
   
  })