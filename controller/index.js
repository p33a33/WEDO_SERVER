const { user } = require('../models');
const { todo } = require('../models');
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
    signEditNickname: (req , res) => {
        const { nickname } = req.body;
        const sess = req.session
        
        user.update({nickname: nickname},{ where: { id:sess.userid }})
            .then((data) => res.status(200).json(data))
            .catch((err)=> {
                console.log(err);
                res.status(500);
            });
    },
    signEditPassword: (req, res) => {
        const { password, newPassword } = req.body;
        const hashingPassword = crypto.createHmac('sha256', '4bproject')
        const sess = req.session
        user.update({ password: newPassword }, { where: hashingPassword })
            .then((data) => {  res.status(205).json(data) })
            .catch((err) => { 
                console.log(err)
                res.status(500)})
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
        const sess = req.session
        todo.findAll({
            where:{ user_id: sess.userid }
        })
        .then((data)=> {res.status(200).json(data)})
        .catch((err) => {
            console.log("데이터를 조회할수 없습니다.",err);
            res.status(500);
        })
    },
    todoWrite: (req, res) => {
        const sess = req.session;
        const { title, body } = req.body;
        user
            .findOne({
                where: {
                    id: 1
                }
            })
            .then((data) => {
                todo
                    .create({
                        user_id: data.id,
                        title: title,
                        body: body
                    })
                    .then( (data) => {
                         res.status(200).json(data);
                        }
                    ).catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    });
            })
    },
    todoEdit: (req,res) =>{
        // 수정할 todo를 어떻게 찾아갈것인가?
        const {id, title, body } = req.body;
        todo.update({title: title, body: body}, {where:{ id: id }})
            .then( (data) => res.status(200).json(data))
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    },
    todoDelete: (req,res) => {
        //삭제할 todo를 어떻게 찾아 갈것인가??
        const { id } = req.body
        todo.destroy({where: {user_id: id}})
        .then((data)=>{
            res.status(200).json({})
        })
        .catch(err => {
            console.error(err);
        })
    }
    //client 연결 했을때 수정에 대해서

    //client
}