const express = require("express");
let Db = require("../../db/db");
let to = require("../../middleware/awiat-to");

const router = express.Router();

// get用来显示登录页面
router.get("/", (req, res) => {
  res.clearCookie("bf_token"); //清除登录cookie
  res.render("admin_login", {
    tip: ""
  });
});
// post用来提交账号和密码，进而判断是否正确
router.post("/", (req, res) => {
  let {
    username,
    password
  } = req.body;
  if (username == "" || password == "") {
    res.render("admin_login", {
      tip: "用户名或密码不能为空"
    });
    // res.send(`<script>alert('用户名或密码不能为空')</script>`);
  } else {
    login(username, password, res);
  }
});
// 登录功能
async function login(username, password, res) {
  let db = new Db("baofeng");
  let [err, userinfo] = await to(
    db.find("admin", {
      user: username,
      pwd: password
    })
  );
  if (err) {
    res.render("admin_login", {
      tip: "登录失败"
    });
  } else if (userinfo.length == 0) {
    res.render("admin_login", {
      tip: "用户名或密码错误"
    });
  } else {
    //token的内容为用的id,这个id是唯一的，用它来验证有效性
    res.cookie("bf_token", userinfo[0]._id, {
      maxAge: 1000 * 60 * 60,
      signed: true //使用cookieParser的key进行加密 秘钥是baofeng
    });
    // 登录成功重定向到首页
    res.redirect("/admin/index");
  }
}
module.exports = router;