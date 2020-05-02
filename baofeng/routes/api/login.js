const express = require("express");
let Db = require("../../db/db");
let to = require("../../middleware/awiat-to");
let encryption = require("../../middleware/hashmac");
let router = express.Router();
// 登录提交
router.post("/", (req, res) => {
    res.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.set("Access-Control-Allow-Credentials", true);
    // console.log(req.cookies);

    let {

        mobile,
        password
    } = req.body;
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
            msg: "请输入正确的密码",
            data: null
        });
    } else {
        //数据库查询，用户输入的用户名和密码是否匹配，如果匹配表示登录成功，否则失败
        // let {
        //     mobile: user,
        //     password: pwd
        // } = req.cookies;
        // if (mobile == user && password == pwd) {
        //     res.send({
        //         code: 200,
        //         msg: "成功",
        //         data: null
        //     });
        // } else {
        //     //向数据库注册
        //     res.send({
        //         code: 204,
        //         msg: "用户名或者密码错误",
        //         data: null
        //     });
        // }
        login(mobile, password, res);
    }

});

async function login(mobile, password, res) {
    let db = new Db("baofeng")
    let [err, count] = await to(db.count("user", {
        username: mobile,
        password: encryption(password)
    }));
    if (err) {
        res.send({
            code: 205,
            msg: "登录失败",
            data: err
        });
    } else {
        if (count == 0) {
            res.send({
                code: 204,
                msg: "用户名或者密码错误",
                data: null
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
module.exports = router;