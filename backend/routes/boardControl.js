var express = require('express');
var router = express.Router();
const models = require('../models');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');
let verify = require('../config/verify');

router.get('/userview', function(req, res, next) {

    let usertoken = req.headers.token;

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
    
    let body = req.body;

    if(verify(usertoken, secretObj.secret)) {
        models.post.destroy({
            where : { no : body.no }
        })
        .then( result => {
            res.json({ success : result });
        })
        .catch( err => {
            console.log("게시글 삭제에 실패했습니다")
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

module.exports = router;