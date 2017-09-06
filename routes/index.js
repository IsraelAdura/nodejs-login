var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', Authenticated, function(req, res, next) {
  res.render('index');
});

function Authenticated(req,res,next){
  if (req.isAuthenticated()){
    return next;
  }
  req.flash('error_msg','You are not logged in');
  res.redirect('users/register')
}
module.exports = router;
