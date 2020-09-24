const { user } = require('../models');
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
    }
}