const express = require("express");
const router = express.Router();

let to = require("../../middleware/awiat-to");
let Db = require("../../db/db");
// /banner/   和/banner
router.get("/:type", (req, res) => {
    res.set("access-control-allow-origin", "*");
    let {
        type = 0
    } = req.params
    movie(type, res);
})

async function movie(type, res) {
    let db = new Db("baofeng");
    let [err, movie] = await to(db.find("movie", {
        type: Number.parseInt(type)
    }));
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
            data: movie
        });
    }
}
module.exports = router;