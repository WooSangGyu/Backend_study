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
            console.log("탐색 완료");
            res.json({ user : result,
                       resultCode : resCode.Success,
                       message: resCode.SuccessMessage 
                    });
        })
        .catch(err => {
            console.log(err);
            res.json({
                resultCode : resCode.Failed,
                message : resCode.ReadError
            })
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message : resCode.VerifyFailError
                });
    }
});

router.get('/boardview', function(req, res, next) {

    let usertoken = req.headers.token;

    let page = req.body.page; // 게시물 페이지 받기
    pageNum = parseInt(page); // Int형으로 변환
    let offset = 0; //오프셋 초기화

    if(pageNum > 1) {
        offset = 10*(pageNum -1); // 건너뛰는 갯수 설정
    }

    if(verify(usertoken, secretObj.secret)) {
        models.post.findAll(
            {
                offset : offset,
                limit: 10 //표시할 갯수
            }
        )
        .then( result => {
            console.log("탐색 완료 했습니다.");
            res.json({ resultCode : resCode.Success,
                       message: resCode.SuccessMessage 
             });
        })
        .catch( err => {
            console.log("탐색에 실패했습니다.");
            console.log(err);
            res.json({
                resultCode : resCode.Failed,
                message : resCode.ReadError
            })
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message : resCode.VerifyFailError
                });
    }
});

router.post('/addpost', function(req, res, next) {

    let usertoken = req.headers.token;

    let body = req.body;

    if(verify(usertoken, secretObj.secret)) {
        models.post.create({
            writer : body.writer,
            title : body.title,
            content : body.content,
            createTime : new Date()
        })
        .then( result => {
            console.log("게시글 추가 완료 :", result);
            res.json({ resultCode : resCode.Success,
                       message: resCode.SuccessMessage 
            })
        })
        .catch( err => {
            console.log("게시글 추가 실패");
            res.json({
                resultCode : resCode.Failed,
                message : resCode.CreateError
            });
        })
    } else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message : resCode.VerifyFailError
                });
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
                    console.log("삭제 완료했습니다.");
                    res.json({ resultCode : resCode.Success,
                               message: resCode.SuccessMessage });
                })
                .catch ( err => {
                    console.log("게시글 삭제에 실패했습니다.");
                    console.log(err);
                    res.json({ resultCode : resCode.Failed,
                               message: resCode.DeleteError });
                })
            }
            else (console.log("게시글을 삭제할 권한이 없습니다."));
            res.json({ resultCode : resCode.AuthorityCode,
                       message: resCode.AuthorityError });

        })
        .catch( err => {
            console.log(err);
            console.log("게시글 정보를 찾지 못했습니다.");
            res.json({ resultCode : resCode.RequestCode,
                       message : resCode.ReadError})
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message : resCode.VerifyFailError
                });
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
                    content : body.content,
                    createTime : new Date()
                    },
                    {
                        where : {no : findpost.dataValues.no}
                })
                .then ( updat => {
                    console.log("수정 완료 :", updat);
                    res.json({ resultCode : resCode.Success,
                               message: resCode.SuccessMessage });
                })
                .catch ( err => {
                    console.log("게시글 수정에 실패했습니다.");
                    console.log(err);
                    res.json({ resultCode : resCode.Failed,
                        message: resCode.UpdateError });
                })
            }
            else (console.log("게시글 수정할 권한이 없습니다."));
            res.json({ resultCode : resCode.AuthorityCode,
                       message: resCode.AuthorityError });
        })
        .catch( err => {
            console.log(err);
            console.log("게시글 정보를 찾지 못했습니다.");
            res.json({ resultCode : resCode.RequestCode,
                       message : resCode.ReadError})
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message : resCode.VerifyFailError
                });
    }
})

router.post('/addreply', function(req, res, next) {

    let usertoken = req.headers.token;
    let body = req.body;

    if(verify(usertoken, secretObj.secret)) {
        models.reply.create({
            postno : body.postno,
            writer : body.writer,
            reply : body.reply,
            createTime : new Date()
        })
        .then( result => {
            console.log("댓글 추가 완료 :", result );
            res.json({ resultCode : resCode.Success,
                       message: resCode.SuccessMessage });
        })
        .catch( err => {
            console.log(err);
            console.log("댓글을 추가하지 못했습니다.");
            res.json({ resultCode : resCode.RequestCode,
                       message : resCode.ReadError})
        });
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message : resCode.VerifyFailError
                });
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
                .then ( result => {
                    console.log("댓글 삭제 완료했습니다.");
                    res.json({ resultCode : resCode.Success,
                               message: resCode.SuccessMessage });
                })
                .catch ( err => {
                    console.log("댓글 삭제에 실패했습니다.");
                    console.log(err);
                    res.json({ resultCode : resCode.Failed,
                               message: resCode.DeleteError });
                })
            }
            else (console.log("댓글을 삭제할 권한이 없습니다."));
            res.json({ resultCode : resCode.AuthorityCode,
                       message: resCode.AuthorityError });
        })
        .catch( err => {
            console.log(err);
            console.log("댓글 정보를 찾지 못했습니다.");
            res.json({ resultCode : resCode.RequestCode,
                       message : resCode.ReadError})
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message : resCode.VerifyFailError
                });
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
                    reply : body.reply,
                    createTime : new Date()
                    },
                    {
                        where : {no : findreply.dataValues.no}
                })
                .then ( updat => {
                    console.log("수정 완료 : ", updat);
                    res.json({ resultCode : resCode.Success,
                               message: resCode.SuccessMessage });
                })
                .catch ( err => {
                    console.log(err);
                    console.log("수정에 실패했습니다");
                    res.json({ resultCode : resCode.Failed,
                               message: resCode.UpdateError });
                })
            }
            else (console.log("댓글을 수정할 권한이 없습니다."));
            res.json({ resultCode : resCode.AuthorityCode,
                       message: resCode.AuthorityError });
        })
        .catch( err => {
            console.log(err);
            console.log("댓글 정보를 찾지 못했습니다.");
            res.json({ resultCode : resCode.RequestCode,
                       message : resCode.ReadError})
        })
    }
    else {
        console.log("토큰이 없거나 만료되었습니다.");
        res.json({ resultCode : resCode.VerifyFailedCode,
                   message : resCode.VerifyFailError
                });
    }
})


module.exports = router;