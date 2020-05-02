const express = require("express");
let Db = require("../../db/db");
let to = require("../../middleware/awiat-to");
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
router.get("/deletemovie/:movieid/:currpage", (req, res) => {
  let {
    movieid = "",
      currpage = 1
  } = req.params;
  delMovie(movieid, currpage, res)
});
router.get("/:page?", (req, res) => {
  let {
    page = 1
  } = req.params;
  console.log(page);

  movie(page, res);
});
//删除影片
async function delMovie(movieid, currpage, res) {
  let err = null,
    count = 0;
  let db = new Db("baofeng");
  [err] = await to(db.delete("movie", {
    _id: ObjectId(movieid)
  }));
  [err, count] = await to(db.count("movie"));
  let totalPage = Math.ceil(count / 5);
  //判断当前删除页的最后一条，如果传入的当前页页码大于数据库最新的分页总页数，则无效，应该使用数据库最新的分页总页数，否则继续使用传入的页码数
  currpage = Number.parseInt(currpage) > totalPage ? totalPage : currpage;
  if (err) {
    //错误处理
    res.redirect(`/admin/list/${currpage}`);
  } else {
    res.redirect(`/admin/list/${currpage}`);
  }
};
async function movie(page, res) {
  let db = new Db("baofeng");
  //预先声明变量
  let err = null,
    data = [],
    count = 0;
  //分页查询数据并解构赋值
  [err, data] = await to(db.pageination({
    coll: "movie",
    skip: (page - 1) * 5,
    limit: 5
  }));
  //查询数据的总量，并解构赋值
  [err, count] = await to(db.count("movie"));
  if (err) {
    //有错渲染空数组
    res.render("admin_list", {
      movieList: [],
      total: 0,
      currpage: 1
    })
  } else {
    // console.log(count);
    res.render("admin_list", {
      movieList: data,
      total: count,
      currpage: page
    })
  }
}
module.exports = router;