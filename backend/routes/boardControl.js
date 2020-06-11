var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var models = require('../models');
var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');
var verify = require('../config/verify');
var sequelize = require('sequelize');
var Op = sequelize.Op;

router.use(cookieParser('asd123'));

router.get('/userview', function(req, res, next) {

    let usertoken = req.signedCookies.token;

    if(verify(usertoken, secretObj.secret)) {
        models.user.findAll()
        .then( result => {
            res.json({ user : result });
        });
    }
    else {
        res.json({ fail });
    }
});

router.get('/boardview', function(req, res, next) {

    let usertoken = req.headers.token;



    if(verify(usertoken, secretObj.secret)) {
        models.post.findAll()
        .then( result => {
            res.json({ posts : result });
        });
    }
    else {
        res.json({ fail });
    }
});

router.post('/addpost', function(req, res, next) {

    let usertoken = req.headers.token;

    let body = req.body;

    if(verify(usertoken, secretObj.secret)) {
        models.post.create({
            writer : body.writer,
            title : body.title,
            content : body.content
        })
        .then( result => {
           res.json({ success : result });
        })
        .catch( err => {
            console.log("게시글 추가 실패");
        });
    } else {
        res.json({ fail })
    }
});

router.delete('/delpost', function(req, res, next) {
    
    let usertoken = req.headers.token;
    let id = req.signedCookies.userid;
    
    
    let body = req.body;

    if(verify(usertoken, secretObj.secret)) {

        models.post.findOne({
            where: { no : body.no}
        })
        .then( findpost => {
            // console.log("찾은 정보 :", findpost.dataValues.writer);
            if (findpost.dataValues.writer === id){
                models.post.destroy({
                    where : {no : findpost.dataValues.no}
                })
                .then ( del => {
                    res.json({ success : del });
                })
                .catch ( err => {
                    console.log(err);
                })
            }
            else (console.log("권한이 없습니다."));
        })
        .catch( err => {
            console.log(err);
            console.log("게시글 정보를 찾지 못했습니다.")
        })
    }
    else {
        res.json({fail})
    }
})

router.put('/uppost', function(req, res, next) {

    let usertoken = req.headers.token;
    let id = req.signedCookies.userid;

    let body = req.body;

    console.log(body);

    if(verify(usertoken, secretObj.secret)) {
        models.post.findOne({
            where: { no : body.no}
        })
        .then( findpost => {
            console.log("찾은 정보 :", findpost);
            if (findpost.dataValues.writer === id){
                models.post.update({
                    title : body.title,
                    content : body.content
                    },
                    {
                        where : {no : findpost.dataValues.no}
                })
                .then ( updat => {
                    console.log("수정 완료했습니다")
                    res.json({ success : updat });
                })
                .catch ( err => {
                    console.log(err);
                    console.log("수정에 실패했습니다")
                })
            }
            else (console.log("권한이 없습니다."));
        })
        .catch( err => {
            console.log(err);
            console.log("게시글 정보를 찾지 못했습니다.")
        })
    }
    else {
        res.json({fail})
    }
})

router.post('/addreply', function(req, res, next) {

    let usertoken = req.headers.token;
    let body = req.body;

    if(verify(usertoken, secretObj.secret)) {
        models.reply.create({
            postno : body.postno,
            writer : body.writer,
            reply : body.reply
        })
        .then( result => {
            res.json({ success : result });
        })
        .catch( err => {
            console.log("댓글 추가 실패");
        });
    }
    else {
        res.json({fail});
    }
});

router.delete('/delreply', function(req, res, next) {
    
    let usertoken = req.headers.token;
    let id = req.signedCookies.userid;
    
    
    let body = req.body;

    if(verify(usertoken, secretObj.secret)) {

        models.reply.findOne({
            where: { no : body.no}
        })
        .then( findreply => {
            // console.log("찾은 정보 :", findpost.dataValues.writer);
            if (findreply.dataValues.writer === id){
                models.findreply.destroy({
                    where : {no : findreply.dataValues.no}
                })
                .then ( del => {
                    res.json({ success : del });
                })
                .catch ( err => {
                    console.log(err);
                })
            }
            else (console.log("권한이 없습니다."));
        })
        .catch( err => {
            console.log(err);
            console.log("댓글 정보를 찾지 못했습니다.")
        })
    }
    else {
        res.json({fail})
    }
})

router.put('/upreply', function(req, res, next) {

    let usertoken = req.headers.token;
    let id = req.signedCookies.userid;

    let body = req.body;

    console.log(body);

    if(verify(usertoken, secretObj.secret)) {
        models.reply.findOne({
            where: { no : body.no}
        })
        .then( findreply => {
            // console.log("찾은 정보 :", findreply);
            if (findreply.dataValues.writer === id){
                models.findreply.update({
                    reply : body.reply
                    },
                    {
                        where : {no : findreply.dataValues.no}
                })
                .then ( updat => {
                    console.log("수정 완료했습니다")
                    res.json({ success : updat });
                })
                .catch ( err => {
                    console.log(err);
                    console.log("수정에 실패했습니다")
                })
            }
            else (console.log("권한이 없습니다."));
        })
        .catch( err => {
            console.log(err);
            console.log("댓글 정보를 찾지 못했습니다.")
        })
    }
    else {
        res.json({fail})
    }
})


module.exports = router;