const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

const UsersRoutes = require('./api/routes/users');
const GameRoutes = require('./api/routes/games');

app.use('/users',sersRoutes);
 U
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message || 'Not found'
        }
    });

});


module.exports = app;