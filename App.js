const express = require('express');

const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// const usersRouter = require('');
// const linkRouter = require('');

const morgan = require('morgan');

const app = express();
const port = 5000;


app.use(
    session({
        secret: '4B', // 상의 후 결정
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
        origin: ['http://localhost:5000'], // 추후변경
        methods: ['GET', 'POST'],
        credential: true
    })
);

// POSTMAN을 통한 test
app.use(morgan('dev'));


// get 요청에 대한 응답 (API)
app.get('/', (req, res) => {
    res.status(200).send('언제까지 Hello?');
});

app.set('port', port);
app.listen(app.get('port'), () => {
    console.log(`app is listening music in PORT ${app.get('port')}`);
});

module.exports = app;
