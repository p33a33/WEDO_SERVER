const { user } = require('../models');
const { todo } = require('../models');
const { follow } = require('../models');
const { todo_user } = require('../models');
const sequelize = require("sequelize");


const crypto = require('crypto');
/* passport로 로그인을 구현하면서 session 구조가 아래와 같이 바뀌었습니다.
{ cookie : { ... }, passport : { user : 유저레코드 아이디 }
따라서 sess = req.session을 session_userid = req.session.passport.user 로
수정합니다. */

// Signin이 Passport로 구현되면서 Signin Controller를 삭제처리 했습니다.

module.exports = {
    signUpController: (req, res) => {
        const { email, password, fullname, nickname } = req.body;

        user.findOrCreate({
            where: {
                email: email,
            },
            defaults: {
                password: password,
                full_name: fullname,
                nickname: nickname
            }
        })
            .then(async ([user, created]) => {
                if (!created) {
                    return res.status(409).send("이미 존재하는 email입니다.");
                }
                const data = await user.get({ plain: true });
                res.status(201).json(data);
            });
    },
    mypageController: (req, res) => {
        const session_userid = req.session.passport.user;
        if (session_userid) {
            user.findOne({
                where: {
                    id: session_userid,
                },
            })
                .then((data) => {
                    if (data) {
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
    signEditNickname: (req, res) => {
        const { nickname } = req.body;
        const session_userid = req.session.passport.user

        user.update({ nickname: nickname }, { where: { id: session_userid } })
            .then((data) => {
                console.log(data);
                res.status(200).json(data)
            })
            .catch((err) => {
                console.log(err);
                res.status(500);
            });
    },
    signEditPassword: (req, res) => {
        const { password, newpassword } = req.body;
        const hashingPassword = crypto.createHmac('sha256', '4bproject')
            .update(password)
            .digest('base64');

        const session_userid = req.session.passport.user;

        user.findOne({
            where: { id: session_userid }
        })
            .then((data) => {
                if (data.password === hashingPassword) {
                    user.update({ password: newpassword }, { where: { id: session_userid } })
                        .then((data) => { res.status(205).json(data) })
                        .catch((err) => {
                            console.log(err)
                            res.status(500)
                        })
                }
            })
    },
    signOutController: (req, res) => {
        const session_userid = req.session.passport.user;
        if (session_userid) {
            req.session.destroy(err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("destroy 성공")
                }
            });
        }
    },


    mainController: (req, res) => {
        const session_userid = req.session.passport.user
        todo.findAll({
            where: { user_id: session_userid }
        })
            .then((data) => { res.status(200).json(data) })
            .catch((err) => {
                console.log("데이터를 조회할수 없습니다.", err);
                res.status(500);
            })
    },
    todoWrite: (req, res) => {
        const session_userid = req.session.passport.user;
        const { title, body } = req.body;
        user
            .findOne({
                where: {
                    id: session_userid
                }
            })
            .then((data) => {
                todo
                    .create({
                        user_id: data.id,
                        title: title,
                        body: body
                    })
                    .then((data) => {
                        res.status(200).json(data);
                    }
                    ).catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    });
            })
    },
    todoEdit: (req, res) => {
        // 수정할 todo를 어떻게 찾아갈것인가?
        const { id, title, body } = req.body;
        const session_userid = req.session.passport.user;

        todo.update({ title: title, body: body }, { where: { id: id } })
            .then(() => {
                todo.findOne({
                    where: {
                        id: id
                    }
                })
                    .then((data) => res.status(200).json(data))
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    });
            })
    },
    todoDelete: (req, res) => {
        //삭제할 todo를 어떻게 찾아 갈것인가??
        const { id } = req.body
        const session_userid = req.session.passport.user;

        todo.destroy({ where: { id: id } })
        then(() => {
            todo.findAll({
                where: {
                    user_id: session_userid
                }
            })
                .then((data) => {
                    res.status(200).json(data)
                })
                .catch(err => {
                    console.error(err);
                })
        })
    },
    clear: (req, res) => {
        const { id } = req.body;

        todo.findOne({
            where: { id: id }
        })
            .then((data) => {
                if (data.isclear === false) {
                    data.update({ isclear: 1 }, { where: { id: id } })
                    then(() => res.status(200).json(data))
                } else if (data.isclear === true) {
                    data.update({ isclear: 0 }, { where: { id: id } })
                    then(() => res.status(200).json(data))
                } else { res.status(400) }
            })
    },


    followAdd: (req, res) => {
        const { friendemail } = req.body;

        user.findOne({
            Where: { email: friendemail }
        })
            .then((data) => {
                follow.create({
                    user_id: id,
                    follow_id: data.id
                })
                res.status(200).end();
            })
            .catch((err) => {
                console.log("일치하는 이메일이 없습니다.", err)
                res.status(400).send("일치하는 email이 없습니다.")
            })
    },
    followList: (req, res) => {
        console.log(req.session)
        const session_userid = req.session.passport.user;
        follow.findAll({
            where: { user_id: session_userid }
        })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                console.log("목록을 불러오는데에 에러:", err);
                res.status(400).send("불러올 친구가 없나봅니다.human")
            })
    },
    followDelete: (req, res) => {
        const session_userid = req.session.passport.user;
        const { followid } = req.body;

        follow.findAll({
            where: { user_id: session_userid }
        })
            .then((data) => {
                data.destroy({ where: { follow_id: followid } })
                    .then(() => res.status(200).end())
                    .catch((err) => res.status(400).send("삭제불가", err))
            })
    },

    shareTodo: (req, res) => {
        const session_userid = req.session.passport.user;
        const { todoid, friendid } = req.body;

        todo_user.create({
            owner_id: session_userid,
            todo_id: todoid,
            share_id: friendid
        })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                console.log("글을 공유할 수 없습니다.", err);
                res.status(400).send();
            });
    },
    shareList: (req, res) => {
        const session_userid = req.session.passport.user;
        const Op = sequelize.Op;

        todo_user.findAll({
            where: {
                [Op.or]: [{ owner_id: session_userid }, { share_id: session_userid }]
            },
        })
            .then((data) => {
                console.log(data);
                res.status(200).json(data);
                // todo.findAll({
                //     where: {
                //         id : [data.todo_id]
                //     }
                // })
                // .then((data)=> {
                //     res.status(200).json(data);
                // })
                // .catch((err)=>{
                //     console.log("todo를 불러올수 없습니다.", err)
                // })
            })
            .catch((err) => {
                console.log("공유글을 불러올 수 없습니다.", err)
                res.status(400).send("공유글을 불러올 수 없습니다.")
            })
    },
    shareClear: (req, res) => {
        const { todoid } = req.body;
        const Op = sequelize.Op;

        todo_user.findOne({
            where: {
                share_id: session_userid,
                todo_id: todoid
            }
        })
            .then((data) => {
                if (data.isclear === true) {
                    data.update({ isclear: 0 })
                        .then(() =>
                            //find
                            res.status(200).json(data));
                }
                else if (data.isclear === false) {
                    data.update({ isclear: 1 })
                        .then(() =>
                            //find
                            res.status(200).json(data));
                }
            })
            .catch((err) => {
                console.log("목록을 찾을수 없습니다.", err)
                res.status(400).send("목록을 찾을 수  없습니다.")
            })
    },
    //todoEdit 사용.
    // shareEdit: (req,res) =>{
    //     const { todoid } = req.body;
    // },
    shareDelete: (req, res) => {
        const { todouserid } = req.body;
        const Op = sequelize.Op;

        todo_user.destroy({
            where: { id: todouserid }
        })
            .then()
    }
}
