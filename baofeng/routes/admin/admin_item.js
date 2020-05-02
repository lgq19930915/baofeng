gitconst express = require("express");
const router = express.Router();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
let Db = require("../../db/db");
let to = require("../../middleware/awiat-to");
let ObjectId = require("mongodb").ObjectId;
//修改编辑的GET
router.get('/:movieid', (req, res) => {
  let {
    movieid
  } = req.params; //解析路径参数
  getMovieInfo(movieid, res);
});
//获取修改的影片信息
// 获取修改的影片信息
async function getMovieInfo(movieid, res) {
  let db = new Db("baofeng");
  let [err, movie] = await to(db.find("movie", {
    _id: ObjectId(movieid)
  }));
  if (err) {
    console.log("查询失败");
  } else {
    let movieinfo = {
      ...movie[0] //使用扩展运算符拷贝数据
    };
    // 下面的switch case不要写字符串的'1' '2',需要写成number数字，否则无法使用。
    switch (movieinfo.definition) {
      case 1:
        movieinfo.definition = "标清";
        break;
      case 2:
        movieinfo.definition = "高清";
        break;
      case 3:
        movieinfo.definition = "超清";
        break;
    }
    switch (movieinfo.vip) {
      case 1:
        movieinfo.vip = "vip免费";
        break;
      case 2:
        movieinfo.vip = "vip专享";
        break;
      case 3:
        movieinfo.vip = "vip限时折扣";
        break;
    }
    switch (movieinfo.type) {
      case 0:
        movieinfo.type = "强力推荐";
        break;
      case 1:
        movieinfo.type = "热映";
        break;
    }

    res.render("admin_item", {
      movieinfo
    });
  }
}
//新增的GET
router.get("/", (req, res) => {
  let movieinfo = {
    id: "",
    title: "",
    detail: "",
    definition: "标清",
    vip: "VIP免费",
    type: "强力推荐",
    score: 5.0,
    img: "/images/default.jpg"
  };
  //render的第二个参数必须是对象
  res.render("admin_item", {
    movieinfo
  });
});
//post请求数据
router.post('/', (req, res) => {
  uploadImage(req, fields => {
    // 如果id为空则新增，否则编辑
    console.log(fields);
    if (fields._id == "") {
      // 上传完毕文件后新增数据
      insertMovie(fields, res);
    } else {
      updateMovie(fields, res);
    }
  });

});
//新增数据
async function insertMovie(fields, res) {
  let db = new Db("baofeng");
  let doc = {
    ...fields
  };
  //删除对象的_id属性
  delete doc._id;
  switch (doc.definition) {
    case "标清":
      doc.definition = 1;
      break;
    case "高清":
      doc.definition = 2;
      break;
    case "超清":
      doc.definition = 3;
      break;
  }
  switch (doc.vip) {
    case "VIP免费":
      doc.vip = 1;
      break;
    case "VIP专享":
      doc.vip = 2;
      break;
    case "VIP限时折扣":
      doc.vip = 3;
      break;
  }
  switch (doc.type) {
    case "强力推荐":
      doc.type = 0;
      break;
    case "热映":
      doc.type = 1;
      break;
  }
  let [err, movie] = await to(db.insert("movie", doc));
  if (err) {
    console.log("新增失败");

  } else {
    res.redirect("/admin/list")
  }
}
// 编辑数据
async function updateMovie(fields, res) {
  let db = new Db("baofeng");
  let doc = {
    ...fields //使用扩展运算符完成对象的拷贝
  };
  console.log(doc._id);
  let movieid = doc._id;
  delete doc._id; //删除对象的属性
  switch (doc.definition) {
    case "标清":
      doc.definition = 1;
      break;
    case "高清":
      doc.definition = 2;
      break;
    case "超清":
      doc.definition = 3;
      break;
  }
  switch (doc.vip) {
    case "vip免费":
      doc.vip = 1;
      break;
    case "vip专享":
      doc.vip = 2;
      break;
    case "vip限时折扣":
      doc.vip = 3;
      break;
  }
  switch (doc.type) {
    case "强力推荐":
      doc.type = 0;
      break;
    case "热映":
      doc.type = 1;
      break;
  }

  let [err] = await to(db.update("movie", {
    _id: ObjectId(movieid)
  }, doc));
  if (err) {
    console.log("更新失败");
  } else {
    // console.log("更新成功");
    res.redirect("/admin/list");
  }
}
//上传图片
function uploadImage(req, callback) {
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    //拿到文件 file是表单的name 不是固定的
    let file = files.file;
    //判断用户是否选择了图片，因为用户可以选择图片，也可以不选，在用户不选择时我们指定一个默认的
    if (file.size == 0) {
      console.log("用户没选图");
      //_id为空表示新增，新增么有图默认一个图片 /image/default.jpg
      if (fields._id == "") {
        fields.img = 'https://localhost:3000/image/default.jpg';
      }
      callback(fields); //回调表单，准备新增或者更新数据
      return;
    }
    //用户选了图
    let {
      name,
      type,
      size
    } = file;
    let ext = path.extname(name); // 获取文件后缀带点的
    //允许的格式
    let allowExts = ['.jpg', '.png', '.jpeg', '.gif'];
    //允许的类型
    let allowType = ['image/jpeg', 'image/png', 'image/gif'];
    //限制上传的文件后缀和文件格式为图片
    if (allowType.includes(type) && allowExts.includes(ext)) {
      //限制文件不要超过100K
      if (size > 102400) {
        console.log("文件超过100K限制");
      } else {
        let rootPath = path.dirname(path.dirname(__dirname));
        let publicPath = path.join(rootPath, "public");
        let uploadPath = path.join(publicPath);
        //判断目录是否存在，没有就新建，不判断，反复调用fs.mkdir创建多个相同目录会报错
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        };
        //生成一个文件名字，文件名字是临时路径下的名字，使用path.basename获取，文件的后缀是前面得到的ext,拼接后就是新的文件名字
        let fileName = path.basename(file.path) + ext;
        let readStream = fs.createReadStream(file.path);
        //写入图片路径
        let filePath = path.join(uploadPath, fileName);
        let writeStream = fs.createWriteStream(filePath);
        // //拷贝完之后，把临时文件删除掉
        writeStream.on("finish", () => {
          fs.unlink(file.path, () => {
            console.log(`${file.path}临时文件已经被删除`);
          });
          fields.img = 'https://localhost:3000/upload/' + fileName;
          callback(fields); //回调表单，准备新增或者更新数据
        });
        // //使用pipe管道操作进行文件的拷贝
        readStream.pipe(writeStream);
      }
    } else {
      console.log("文件不合法");

    }
  });
}
module.exports = router;