// var express = require('express');
// var router = express.Router();
// const models = require('../models');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/', function(req, res, next){
//   let body = req.body;

//   models.user.create({
//       id : body.id,
//       password : body.password,
//       name : body.name,
//       gender : body.gender
//   })
//   .then( profile => {
//       console.log("회원가입 성공");
//       res.json({ success : profile })
//   })
//   .catch( err => {
//       console.log("회원가입 실패");
//       console.log(err);
//   });
// });


// module.exports = router;
