var express = require('express');
var router = express.Router();
const models = require('../models');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user', { title: 'Express' });
});


router.get('/signup', function(req, res, next){
    let body = req.body;

    models.user.create({
        id : body.id,
        password : body.password,
        name : body.name,
        gender : body.gender
    })
    .then( profile => {
        console.log("회원가입 성공");
        res.json({ success : profile })
    })
    .catch( err => {
        console.log("회원가입 실패");
        console.log(err);
    });
});

router.get('/signin', function(req, res, next) {
    let body = req.body;

    models.user.findOne({ where : {
        id : body.id,
        password : body.password
    }})
    .then(userprofile => {
        let jwttoken = jwt.sign({
            id : userprofile.dataValues.id
        }, secretObj.secret ,
        {
            expiresIn: '1h'
        })
        res.json({
            token : jwttoken}
            );
    })
    .catch(err => {
        console.log("로그인에 실패했습니다.");
    });
});




module.exports = router;
