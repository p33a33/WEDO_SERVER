const express = require('express');
const app = express();

app.use('/', (req, res) => {
    res.send('언제까지 Hello?');
});

app.listen(5000, () => {
    console.log('server on 5000');
});