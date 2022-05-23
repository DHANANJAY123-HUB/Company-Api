require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
//const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const indexModel = require('./model/indexModel')
//const imgModel = require('./model/imageModel');

const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const indexRouter = require('./routes/index');



const app = express();

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


app.use('/', indexRouter);
app.use('/admin',adminRouter);
app.use('/users', userRouter);

/*app.get('/',{
  headers: {
    Authorization: 'Bearer '+ authentication.getToken()
  }
});*/


/*app.get("/:filename", async (req, res) => {
    try {
        const file = await indexModel.findOne({ filename: req.params.filename });
        const readStream = indexRouter.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});*/

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
