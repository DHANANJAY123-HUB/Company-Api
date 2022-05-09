require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const indexModel = require('./model/indexModel')
var imgModel = require('./model/imageModel');


var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
//app.use(express.bodyParser());
//app.use(express.cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({'secret':'my pet name is shanky'}))

app.use('/users', userRouter);
app.use('/', indexRouter);


app.get("/:filename", async (req, res) => {
    try {
        const file = await indexModel.findOne({ filename: req.params.filename });
        const readStream = indexRouter.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

/*app.get('/', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.send('imagesPage', { items: items });
        }
    });
});*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.setHeader("Content-Type", "text/html");
  res.status(err.status|| 500);
  /*res.status(err.status || 200);
  res.status(err.status || 400);*/
  res.send('error');
});

module.exports = app;
