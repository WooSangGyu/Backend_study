var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
const models = require('../models');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

router.use(cookieParser('asd123'));

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


router.get('/signin', function(req, res) {
    res.render('login');
});

router.post('/signin', function(req, res, next) {
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
        var id = userprofile.dataValues.id;
        console.log(jwttoken);

        res.cookie('userid', id, { signed:true });
        console.log("아이디 저장완료");
        res.json({ success : jwttoken });
        // res.redirect('/login')
    })
    .catch(err => {
        console.log(err);
        console.log("로그인에 실패했습니다.");
    });
});

router.get('/login', function(req, res, next) {
    let token = req.headers.token;
    let id = req.signedCookies.userid;
    
    console.log(token);
    console.log(id);

    let decoded = jwt.verify(token, secretObj.secret);
    console.log(decoded);
    if(decoded){
      res.send("권한이 있습니다.")
    } else {
      res.send("권한이 없습니다.")
    }
  })




module.exports = router;
