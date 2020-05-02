const express = require("express");
const router = express.Router();

let to = require("../../middleware/awiat-to");
let Db = require("../../db/db");
// /banner/   和/banner
router.get("/", (req, res) => {
    res.set("access-control-allow-origin", "*");
    banner(res);
})

async function banner(res) {
    let db = new Db("baofeng");
    let [err, banners] = await to(db.find("banner"));
    if (err) {
        res.send({
            code: 201,
            msg: "失败",
            data: err
        })
    } else {
        res.send({
            code: 200,
            msg: "成功",
            data: banners
        });
    }
}
module.exports = router;