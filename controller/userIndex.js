const { user } = require('../models');
const { todo } = require('../models')
const crypto = require('crypto');
module.exports = {
    signInController: (req, res) => {
        const sess = req.session;
        const { email, password } = req.body;
        const hashingPassword = crypto.createHmac('sha256', '4bproject')
        .update(password)
        .digest('base64');
        //signin 으로 입력된 비밀번호를 다시 해싱
        user.findOne({
            where: {
                email: email,
                password: hashingPassword
            },
        })
        .then((data)=> {
            if(!data){
                return res.status(404).send("아이디와 비밀번호를 확인해주세요.")
            }
            sess.userid = data.id;
            res.status(200).json({
                id: data.id,
            })
        })
        .catch((err)=> {
            res.status(404).send(err);
        });
    },
    signUpController: (req,res) =>{
        const {email, password, full_name, nickname} = req.body;

        user.findOrCreate({
            where: {
                email: email,
            },
            defaults: {
                password: password,
                full_name: full_name,
                nickname: nickname
            }
        })
        .then(async ([user, created]) =>{
            if(!created) {
                return res.status(409).send("이미 존재하는 email입니다.");
            }
            const data = await user.get({ plain: true });
            res.status(201).json(data);
        });
    },
    mypageController:( req, res ) => {
        const sess = req.session;
        if(sess.userid){
            user.findOne({
                where: {
                    id: sess.userid,
                },
            })
            .then((data) => {
                if(data) {
                    return res.status(200).json(data);
                }
                res.sendStatus(204);
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
        } else {
            res.status(401).send("세션을 찾지 못했습니다.")
        }
    },
    signEditController: (req , res) => {
        const {nickname,password,newPassword } = req.body;
        const sess = req.session
        if(nickname){
            user.update({nickname: nickname}, {where:{ id:sess.userid }})
            .then( (data) => res.status(200).json(data))
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
        } else if(password && newPassword){
            const hashingPassword = crypto.createHmac('sha256', '4bproject')
            .update(password)
            .digest('base64');
            user.findOne({
                where: {password: hashingPassword}
            }).then((data) => {
                if(data){
                    user.update({password: newPassword}, {where:{id:sess.userid }})
                    .then((data) => res.status(205).json(data))
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    });
                }else if(!data){
                    res.status(404).send("비밀번호를 확인해주세요.")
                }
             })
        }else {
            res.status(400).send("회원정보를 수정할 수 없습니다.")
        }
    },
    signOutController: (req, res) => {
        const sess = req.session;
        if(sess.userid){
            req.session.destroy(err => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        }else {
            res.redirect('/');
        }
    },
    mainController: (req, res) => {
        const todos = todo.findAll();
        //todos 가 없을때는 어떻게 해야할까?? 
         res.status(200).json(todos);
    }
}