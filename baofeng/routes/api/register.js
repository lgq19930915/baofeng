const express = require("express");
var svgCaptcha = require("svg-captcha");
let Db = require("../../db/db");
let to = require("../../middleware/awiat-to");
let encryption = require("../../middleware/hashmac");
let router = express.Router();
// 验证码生成路由设置
router.get('/code', function (req, res) {
    var captcha = svgCaptcha.create({
        width: 90,
        height: 30,
        fontSize: 35
    });
    req.session.captcha = captcha.text; //存储验证码到session中
    res.type('svg'); //设置content-type为SVG
    res.status(200).send(captcha.data); //发送过去
});
//注册提交
router.post("/", (req, res) => {
    res.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); //跨域请求头 不能设置*号了，要设置具体服务器
    res.set("Access-Control-Allow-Credentials", true); //服务端下发到客户端的 response 中头部字段，意义是允许客户端携带验证信息，例如 cookie 之类的。
    // console.log(req.session.captcha);
    // console.log(req.body);
    let {
        mobile,
        password,
        code
    } = req.body;
    // console.log(req.session);

    if (mobile == "" || password == "") {
        // console.log("用户名密码不能为空");
        res.send({
            code: 201,
            msg: "用户名密码不能为空",
            data: null
        });
    } else if (!/^1[3-9]\d{9}$/.test(mobile)) {
        // console.log("请输入正确的手机号");
        res.send({
            code: 202,
            msg: "请输入正确的手机号",
            data: null
        });
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(password)) {
        // console.log("请填写正确的密码");
        res.send({
            code: 203,
            msg: "密码强度不够哦",
            data: null
        });
    } else if (String(code).toLowerCase() !== String(req.session.captcha).toLowerCase()) {
        res.send({
            code: 204,
            msg: "请输入正确的验证码",
            data: null
        });
    } else {
        // let isReg = false; //伪代码，默认注册
        // if (isReg) {
        //     res.send({
        //         code: 205,
        //         msg: "手机号已经注册",
        //         data: null
        //     });
        // } else { //向数据库注册 session模拟
        //     // res.set("set-cookie", `mobile=${mobile};password=${password};sameSite=none;secure`);

        //     // res.set("set-cookie", ["mobile=13321177828", "password=12345Qaz"])

        //     res.send({
        //         code: 200,
        //         msg: "注册成功",
        //         data: null
        //     });
        // }
        //调用注册方法
        reg(mobile, password, res);
    }

});
async function reg(mobile, password, res) {
    let db = new Db("baofeng");
    //从数据库查询是否有相同手机号的数据，如果有表明注册过，否则没注册过
    let [err, count] = await to(db.count("user", {
        username: mobile
    }));
    //查询失败（程序报错）
    if (err) {
        res.send({
            code: 206,
            msg: "注册失败",
            data: err
        });
    } else {
        //不等于0表示查到了数据
        if (count != 0) {
            res.send({
                code: 205,
                msg: "当前手机号已经注册",
                data: null
            })
        } else {
            //向数据库注册账号
            let [err] = await to(db.insert("user", {
                username: mobile,
                password: encryption(password)
            }));
            if (err) {
                res.send({
                    code: 206,
                    msg: "注册失败",
                    data: err
                });
            } else {
                res.send({
                    code: 200,
                    msg: "成功",
                    data: null
                });
            }

        }

    }


}
module.exports = router;