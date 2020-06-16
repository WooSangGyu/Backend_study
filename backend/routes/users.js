var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
const models = require('../models');
var jwt = require('jsonwebtoken');
var verify = require('../config/verify');
var secretObj = require('../config/jwt');
var resCode = require('../resCode/codes');


router.use(cookieParser('asd123'));

router.get('/signup', function(req, res, next){
    let body = req.body;

    models.user.create({
        id : body.id,
        password : body.password,
        name : body.name,
        gender : body.gender,
        createTime : new Date()
    })
    .then( profile => {
        console.log("회원가입 성공");
        res.json({ resultCode : resCode.Success , message: resCode.SuccessMessage })
    })
    .catch( err => {
        console.log("회원가입 실패");
        res.json({ resultCode : resCode.Failed , message: resCode.FailedMessage })
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
            expiresIn: '10m'
        })
        var id = userprofile.dataValues.id;
        console.log(jwttoken);

        res.cookie('userid', id, { signed:true });
        console.log("아이디 저장완료");
        res.json({ resultCode : resCode.Success,
                   message: resCode.SuccessMessage });
    })
    .catch(err => {
        console.log(err);
        res.json({ resultCode : resCode.Failed,
                   message: resCode.ReadError });
    });
});

router.get('/searchview', function(req, res, next) {
    
    let usertoken = req.headers.token;

    let body = req.body;
    // console.log(body);

    if(verify(usertoken, secretObj.secret)) {
        models.user.findAll({
            attributes : [body.sel]
        })
        .then(result => {
            console.log(result);
            res.json({ resultCode : resCode.Success,
                       message: resCode.SuccessMessage });
        })
        .catch(err => {
            console.log(err);
            res.json({ resultCode : resCode.Failed,
                       message: resCode.ReadError });
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message: resCode.VerifyFailError });
    }
})

router.get('/checkpost', function(req, res, next) {
    
    let usertoken = req.headers.token;
    let id = req.signedCookies.userid;

    if(verify(usertoken, secretObj.secret)) {
        models.post.findAll({
            where : {
                writer : id
            }
        })
        .then( findpost => {
            res.json({ resultCode : resCode.Success,
                       message: resCode.SuccessMessage });
        })
        .catch( err => {
            res.json({ resultCode : resCode.Failed,
                       message: resCode.ReadError });
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message: resCode.VerifyFailError });
    }
})

router.put('/pwup', function(req, res, next) {
    let usertoken = req.headers.token;
    let id = req.signedCookies.userid;

    let body = req.body;

    if(verify(usertoken, secretObj.secret)) {
        models.user.update({
            password : body.pwd
        },
        {
            where : { id : id }
        })
        .then( pwup => {
            console.log("비밀번호 변경 완료");
            res.json({ resultCode : resCode.Success,
                       message: resCode.SuccessMessage });
        })
        .catch( err => {
            console.log("비밀번호 변경 실패");
            console.log(err);
            res.json({ resultCode : resCode.Failed,
                       message: resCode.UpdateError });
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message: resCode.VerifyFailError });
    }
})


module.exports = router;
