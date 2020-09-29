const express = require('express');

const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const controller = require('./controller/index');

// const usersRouter = require('');
// const linkRouter = require('');

const morgan = require('morgan');

const app = express();
const port = 3000;


app.use(
    session({
        secret: '@4B', // 상의 후 결정
        resave: false,
        saveUninitialized: true
    })
);

// cookieParser로 넘어온 cookie데리터를 관리 쉽게 JSON객체로 변환
app.use(cookieParser());

// express.json 으로 넘어온 데이터 JSON 객체로 변환

app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:3000"],
        method: ["GET", "POST"],
        credentials: true
    })
);

// POSTMAN을 통한 test
app.use(morgan('dev'));


// get 요청에 대한 응답 (API)
app.post("/signin", controller.signInController);
app.post("/signup", controller.signUpController);
app.post("/signout", controller.signOutController);
app.post("/signeditnickname", controller.signEditNickname);
app.post("/signeditpassword", controller.signEditPassword);

app.get("/mypage", controller.mypageController);
app.get("/main", controller.mainController);
app.post("/todoedit", controller.todoEdit);
app.post("/todowrite", controller.todoWrite);
app.post("/tododelete", controller.todoDelete);
app.post("/clear", controller.clear);

app.post("/followadd", controller.followAdd);
app.get("/followlist", controller.followList);
app.post("/followdelete", controller.followDelete);

app.post("/sharetodo", controller.shareTodo);
app.get("/sharelist", controller.shareList);
app.set('port', port);
app.listen(app.get('port'), () => {
    console.log(`app is listening music in PORT ${app.get('port')}`);
});

module.exports = app;
///
