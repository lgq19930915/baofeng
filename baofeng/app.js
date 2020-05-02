var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var logger = require('morgan');
var Db = require("./db/db");
var to = require("./middleware/awiat-to");
const ObjectId = require('mongodb').ObjectId; //
//后台路由引入
var adminIndexRouter = require('./routes/admin/admin_index');
var adminItemRouter = require('./routes/admin/admin_item');
var adminListRouter = require('./routes/admin/admin_list');
var adminLoginRouter = require('./routes/admin/admin_login');
//引入前台路由
var regsRouter = require('./routes/api/register');
var loginRouter = require('./routes/api/login');
var bannerRouter = require('./routes/api/banner');
var movieRouter = require('./routes/api/movie');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 修改EJS后缀
app.engine('html', require("ejs").renderFile)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser("baofeng"));
app.use(session({
  secret: "baofeng",
  saveUninitialized: false,
  resave: true,
  cookie: {
    secure: true,
    sameSite: "none"
  }
})); //配置session
app.use(express.static(path.join(__dirname, 'public')));
//配置路由前台
app.use('/register', regsRouter);
app.use('/login', loginRouter);
app.use('/banner', bannerRouter);
app.use('/movie', movieRouter);
//后台路由拦截(注意位置，在配置前台路由下面去拦截，不能拦截前台路由，也不能拦截前台登录路由)

//简单拦截
app.use('/admin/login', adminLoginRouter); //如果使用复杂拦截  这个必须写在复杂拦截前面
// app.use((req, res, next) => {
//   if (bf_token == "islogin") {
//     next();
//   } else if (req.url == "/admin/login") {
//     next();
//   } else {
//     res.redirect("/admin/login");
//   }
// });
//复杂拦截
app.use((req, res, next) => {
  let {
    bf_token
  } = req.signedCookies; //bf_token存储在加密的cookie中
  let db = new Db("baofeng");
  //mongodb中的_id是ObjectId类型，所以不能直接传入字符串的_id,需要使用ObjectId方法包裹一下，把字符串类型转为ObjectId类型
  db.count("admin", {
    _id: ObjectId(bf_token)
  }).then(rst => {
    if (rst == 1) {
      next();
    } else {
      res.redirect("/admin/login")
    }
  }).catch(err => {
    res.redirect("/admin/login")
  });
});
//配置路由后台

app.use('/admin/index', adminIndexRouter);
app.use('/admin/item', adminItemRouter);
app.use('/admin/list', adminListRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;