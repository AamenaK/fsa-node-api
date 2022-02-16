const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/index');
const deafultRouter = require('./routes/defaultRouter');
const userRouter = require('./routes/userRouter');

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(bodyParser.json());

mongoose.connect(config.dbConStr)
    .then(res => console.log('Connected to MongoDb'))
    .catch(err => console.log('failed to connect to db'));

//middelware

function validate(req, res, next) {
    // res.status(401);
    // res.send('Unauthorized');

    next();
}

// public routes
app.use('/', deafultRouter);

app.use(validate);

// private routes
app.use('/api/users', userRouter);