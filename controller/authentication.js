const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const sequelize = require("sequelize");
const { user } = require(`../models`)


module.exports = {
    signin(req, res) {
        /* 클라이언트에서 Form 태그의 Submit을 통해 들어온 데이터를 Passport를 통해 처리하는 과정입니다*/

        // 인증과정을 처리할 Strategy를 설정하는 부분입니다. *Strategy는 Passport Library에서 제공하는 인증 방식을 뜻합니다.
        passport.use(new LocalStrategy(
            {
                usernameField: `email`,             // Passport에서는 아이디는 username, 비밀번호는 password라는 이름으로 기본적으로 설정되어 있어서,
                passwordField: `password`
            },       // 해당 이름으로 Req 데이터를 받아야 처리되는데, 그 이름을 객체에 담아 변경할 수 있습니다.

            (username, password, done) => {            /* req 받은 username(email)과 password를 DB와 비교하는 데이터 처리 함수를 정의했습니다. */
                user.findOne({
                    where: {
                        email: username,
                        password: password
                    }
                })
                    .then(data => {
                        if (data) {
                            return done(null, data.dataValues)
                        } else {
                            return done(null, false, { message: `아이디나 비밀번호를 확인해주세요` })
                        }
                    })
            }))

        // 위에서 정의한 함수를 바탕으로, 실제로 Success와 Failure 결과를 반환하는 함수입니다. app.post('/signin', callback)의 callback 자리에 들어가는 함수입니다.
        // callback으로 사용될 경우 인자가 필요 없지만, 지금과 같이 떨어져 있는 경우에는 뒤에 (req, res) 인자를 반드시 줘야합니다(실행의 개념).
        passport.authenticate('local', {
            successRedirect: 'http://localhost:3000/main',
            failureRedirect: 'http://localhost:3000/'
        })(req, res)

        // authenticate에서 Success 되었다면, 해당 유저를 구분할 수 있도록 Session에 해당 유저의 Unique한 데이터를 담습니다.
        passport.serializeUser((user, done) => { // serializeUser 메소드에 오는 인자 user는 로그인 성공 판정 함수에서 반환하는 해당 유저의 정보입니다. [현재 파일 27번째줄 done의 두번째 인자를 여기로 끌고옵니다.]
            done(null, user.id) // session에 users 테이블의 id값을 담았습니다.
        })


        // serialize가 된 user가 Session을 유지하고 있는지(권한이 있는지) 확인하기위해 페이지 이동시 마다 user의 정보를 확인합니다.
        // 현재 작동 안되는데 왜 안되는지 모르겠습니당

        passport.deserializeUser((userId, done) => {
            console.log('is deserialize working?')
            // user.findOne({
            //     where: {
            //         id: userId
            //     }
            // }).then(data => {
            //     let { email, nickname, full_name } = data.dataValues
            //     return done({ email, nickname, full_name }, null)
            // })
        })
    }
}
