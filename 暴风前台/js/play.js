// 视频窗口选集商品切换选项卡
var two_right = document.getElementById("two_right");
var li = two_right.getElementsByTagName("li");
var two_right_div = two_right.getElementsByTagName("div");

//点击显示对应内容
li[0].onclick = function () {
    li[0].style.color = "#009cff";
    li[0].style.borderBottom = "1px solid #009cff";
    li[1].style.color = "#fff";
    li[1].style.borderBottom = "none";
    two_right_div[0].style.display = "block";
    two_right_div[1].style.display = "none";
}
li[1].onclick = function () {
    li[1].style.color = "#009cff";
    li[1].style.borderBottom = "1px solid #009cff";
    li[0].style.color = "#fff";
    li[0].style.borderBottom = "none";
    two_right_div[1].style.display = "block";
    two_right_div[0].style.display = "none";
}
// 点赞
var dz = document.getElementById("dz");
var dz_span = dz.getElementsByTagName("span");
var dz_i = dz.getElementsByTagName("i");
// 点
var flag = true;
dz_span[0].onclick = function () {

    if (flag) {
        dz_span[0].style.backgroundPosition = "0px -272px";
        dz_i[0].innerHTML = Number(dz_i[0].innerHTML) + 1;
        flag = false;
    } else {
        dz_span[0].style.backgroundPosition = "0px 0px";
        dz_i[0].innerHTML = Number(dz_i[0].innerHTML) - 1;
        flag = true;
    }
}
// 踩
dz_span[1].onclick = function () {
    if (flag == true) {
        dz_span[1].style.backgroundPosition = "0px -307px";
        dz_i[1].innerHTML = Number(dz_i[1].innerHTML) - 1;
        flag = false;
    } else {
        dz_span[1].style.backgroundPosition = "0px -35px";
        dz_i[1].innerHTML = Number(dz_i[1].innerHTML) + 1;
        flag = true;
    }
}
// 收藏
dz_span[2].onclick = function () {
    if (dz_span[2].flag == true) {
        dz_span[2].style.backgroundPosition = "0px -342px";
        dz_span[2].flag = false;
    } else {
        dz_span[2].style.backgroundPosition = "0px -70px";
        dz_span[2].flag = true;
    }
}
// 下载模块
var xz = document.getElementById("xz");
var xz_span = xz.getElementsByTagName("span");
var xz_i = xz.getElementsByTagName("i");
// 下载
xz_span[0].onclick = function () {
    if (xz_span[0].flag == true) {
        xz_span[0].style.backgroundPosition = "0px -431px";
        xz_span[0].flag = false;
    } else {
        xz_span[0].style.backgroundPosition = "0px -159px";
        xz_span[0].flag = true;
    }
}
// 分享
xz_span[1].onclick = function () {
    if (xz_span[1].flag == true) {
        xz_span[1].style.backgroundPosition = "0px -505px";
        xz_span[1].flag = false;
    } else {
        xz_span[1].style.backgroundPosition = "0px -233px";
        xz_span[1].flag = true;
    }
}
// 剧透
xz_span[2].onclick = function () {
    if (xz_span[2].flag == true) {
        xz_span[2].style.backgroundPosition = "0px -471px";
        xz_span[2].flag = false;
    } else {
        xz_span[2].style.backgroundPosition = "0px -199px";
        xz_span[2].flag = true;
    }
}
// 猜你喜欢
// 获取标签
var enjoy = document.getElementById("enjoy");
// ajax请求数据
ujiuye.ajax({
    "url": "./static/playMove.json",
    "type": "get",
    "success": function (req) {
        var enjoyArr = req;
        var enjoy_cot = "";
        for (var i = 0; i < 10; i++) {
            enjoy_cot += "<div class='enjoy_content'>";
            enjoy_cot += ' <a href="#">';
            enjoy_cot += '  <img src=' + enjoyArr[i].img + ' alt="">';
            enjoy_cot += '<span class="content_s1">' + enjoyArr[i].title + '</span>';
            enjoy_cot += ' <span class="content_s2">' + enjoyArr[i].detail + '</span>';
            enjoy_cot += ' <span class="content_s3">' + enjoyArr[i].score + '</span>';
            enjoy_cot += '</a></div>';
            enjoy.innerHTML = enjoy_cot;
        }
    }
})
// 评论框检测
// 获取评论框
var plk = document.getElementById("plk");
// 获取i标签显示评论框可输入字数量
var floor_2_two_right = document.getElementById("floor_2_two_right");
var floor_2_two_right_i = floor_2_two_right.getElementsByTagName("i")[0];
plk.oninput = function () {
    if (plk.length >= 139) {
        plk.length = 139;
    }

    floor_2_two_right_i.innerHTML = 140 - (plk.value.length);
}

// 评论区请求后台数据，实现静态布局
// 1获取元素
// 内容
// ajax出来的数据全局变量
var arrrr = null;
var comment_list = document.getElementById("comment_list");
// 翻页
var commentPage = document.getElementById("comment_page");
// 确定 上一页 下一页
var pageSpan = commentPage.getElementsByTagName("span");
// 总页数
var pageEm = commentPage.getElementsByTagName("em")[0];
// 当前页
var pageInp = commentPage.getElementsByTagName("input")[0];
// 评论区点赞标签
var plq_dz = comment_list.getElementsByTagName('span');
// 评论区点赞量标签
var plq_dzl = comment_list.getElementsByTagName('i');
// 总页数
var pageInfo = 0;
// 存数据
var recommendArr = [];
// 当前页面状态
var page = 0;
// 2请求后台数据，实现静态布局
ujiuye.ajax({
    "url": "./static/recommend.json",
    "type": "get",
    "success": function (res) {
        // recommendArr = res.comment
        arrrr = recommendArr = res.comment;

        // 总页数
        pageInfo = Math.ceil(recommendArr.length / 6);
        pageEm.innerHTML = pageInfo;
        pageShow(recommendArr, pageInfo);
        // 点击下一页
        pageSpan[2].onclick = function () {
            page++;
            // 当前页面等于总页面不能继续下一页，当前页要等于总页数-1
            if (page == pageInfo) {
                page = pageInfo - 1;
                // 当前页要等于总页数-1时下面页面不需要继续执行了
                return
            }
            pageShow(recommendArr, pageInfo);
        }
        // 点击上一页
        pageSpan[1].onclick = function () {
            page--;
            if (page < 0) {
                page = 0;
                return
            }
            // 当前页面等于总页面不能继续下一页，当前页要等于总页数-1
            if (page == pageInfo) {
                page = pageInfo - 1;
                // 当前页要等于总页数-1时下面页面不需要继续执行了
                return
            }
            pageShow(recommendArr, pageInfo);
        }
        // 评论区点赞
        for (var i = 0; i < plq_dz.length; i++) {
            plq_dz[i].index = i;
            plq_dz[i].onclick = function () {
                plq_dzl[this.index].innerHTML = parseInt(plq_dzl[this.index].innerHTML) + 1
            }
        }
    }
})
// console.log(arrrr);

// 热度 最新排序
var comment = document.getElementById("comment");
var comment_a = comment.getElementsByTagName("a");

// 最新排序
comment_a[1].onclick = function () {
    comment_a[1].className = "active";
    comment_a[0].className = "default";
    arrrr.sort(function (a, b) {
        return Date.parse(b.date) - Date.parse(a.date)
    })
    // 总页数
    pageInfo = Math.ceil(arrrr.length / 6);
    pageEm.innerHTML = pageInfo;
    pageShow(arrrr, pageInfo);
    // 点击下一页
    pageSpan[2].onclick = function () {
        page++;
        // 当前页面等于总页面不能继续下一页，当前页要等于总页数-1
        if (page == pageInfo) {
            page = pageInfo - 1;
            // 当前页要等于总页数-1时下面页面不需要继续执行了
            return
        }
        pageShow(arrrr, pageInfo);
    }
    // 点击上一页
    pageSpan[1].onclick = function () {
        page--;
        if (page < 0) {
            page = 0;
            return
        }
        // 当前页面等于总页面不能继续下一页，当前页要等于总页数-1
        if (page == pageInfo) {
            page = pageInfo - 1;
            // 当前页要等于总页数-1时下面页面不需要继续执行了
            return
        }
        pageShow(arrrr, pageInfo);
    }
    pageShow(arrrr, pageInfo);
}
// 热度排序
comment_a[0].onclick = function () {
    comment_a[0].className = "active";
    comment_a[1].className = "default";
    arrrr.sort(function (a, b) {
        return b.count - a.count;
    })
    // 总页数
    pageInfo = Math.ceil(arrrr.length / 6);
    pageEm.innerHTML = pageInfo;
    pageShow(arrrr, pageInfo);
    // 点击下一页
    pageSpan[2].onclick = function () {
        page++;
        // 当前页面等于总页面不能继续下一页，当前页要等于总页数-1
        if (page == pageInfo) {
            page = pageInfo - 1;
            // 当前页要等于总页数-1时下面页面不需要继续执行了
            return
        }
        pageShow(arrrr, pageInfo);
    }
    // 点击上一页
    pageSpan[1].onclick = function () {
        page--;
        if (page < 0) {
            page = 0;
            return
        }
        // 当前页面等于总页面不能继续下一页，当前页要等于总页数-1
        if (page == pageInfo) {
            page = pageInfo - 1;
            // 当前页要等于总页数-1时下面页面不需要继续执行了
            return
        }
        pageShow(arrrr, pageInfo);
    }
}
// 获取数据函数
function pageShow(recommendArr, pageInfo) {
    var str = "";
    var end = (page + 1) * 6 > recommendArr.length ? recommendArr.length : (page + 1) * 6;
    for (var i = page * 6; i < end; i++) {
        str += '<li><div class="comment_user clearfix"> <img class=" tx" src=' + recommendArr[i].imgIco + ' alt=""> </div><div class=" yhm"><p class="name">' + recommendArr[i].userId + '</p> <p class="time">' + recommendArr[i].date + recommendArr[i].time + '</p> </div><div class="pl clearfix" id="pl"><p class="pl_p1"> ' + recommendArr[i].content + '</p><p class="pl_p2"><a class="jb" id="jb" href="#">举报</a><span id="plq_dz"><i>' + recommendArr[i].count + '</i></span></p></div></li>'
    }
    comment_list.innerHTML = str;
    // 上一页 只要当前页数大于0
    if (page > 0) {
        pageSpan[1].className = "active";
    } else {
        pageSpan[1].className = "default";
    }
    // 下一页 总页数大于1 并且当前页面数小于0
    if (pageInfo > 1) {
        pageSpan[2].className = "active";
    } else {
        pageSpan[2].className = "default";
    }
    pageInp.value = page + 1;
    // 评论区点赞
    for (var i = 0; i < plq_dz.length; i++) {
        plq_dz[i].index = i;
        plq_dz[i].onclick = function () {
            plq_dzl[this.index].innerHTML = parseInt(plq_dzl[this.index].innerHTML) + 1
        }
    }
}
// 热门推荐
// 获取标签
var hot_cot = document.getElementById("hot_cot");
ujiuye.ajax({
    "url": "./static/movelist.json",
    "type": "get",
    "success": function (res) {
        var hot_cotArr = res.hot;
        // console.log(hot_cotArr);

        var astr = "";
        for (var i = 0; i < hot_cotArr.length; i++) {
            astr += '<div class="hot_cot_cot">';
            astr += '<a href="#">';
            astr += '<img src="' + hot_cotArr[i].img + '"alt="">';
            astr += '<p>' + hot_cotArr[i].title + '</p></a></div>';
            hot_cot.innerHTML = astr;
            // console.log(hot_cot);
        }
    }
})
// 电影排行榜
var hotRightContent = document.getElementById("hot_right_content");
var hotRightUl = hotRightContent.getElementsByTagName("ul")[0];
var hotRightLi = hotRightUl.getElementsByTagName("li");
// console.log(hotRightLi)
// var hotRightNum = document.getElementById("n-um");
ujiuye.ajax({
    "url": "./static/play.json",
    "type": "get",
    "success": function (res) {
        console.log(res);

        hotRightUl.innerHTML = HotMove(res.Move_hot);

        function HotMove(hotArr) {
            var str = "";
            for (i = 0; i < hotArr.length; i++) {
                str += ' <li class="hot_right_click"><p class="firstP"><em>' + (i + 1) + '</em>' + hotArr[i].title + '<i>' + hotArr[i].score + '</i></p><b class="first"><img src="' + hotArr[i].img + '" alt=""><span class="hot_right_bg"></span><span class="hot_right_tit"><em>' + (i + 1) + '</em>' + hotArr[i].title + '</span></b></li>';
            }
            return str
        }

        var hotRightP = hotRightUl.getElementsByTagName("p");
        var hotRightImg = hotRightUl.getElementsByTagName("b");
        for (e = 0; e < hotRightLi.length; e++) {
            // console.log(hotRightLi[e])
            hotRightLi[e].index = e;
            // 点击添加Class名 
            for (a = 0; a < hotRightLi.length; a++) {
                hotRightP[a].className = "";
                hotRightImg[a].className = "";
            }
            hotRightP[0].className = "firstP";
            hotRightImg[0].className = "first";
            hotRightLi[e].onclick = function () {
                for (a = 0; a < hotRightLi.length; a++) {
                    hotRightP[a].className = "";
                    hotRightImg[a].className = "";
                }
                hotRightP[this.index].className = "firstP";
                hotRightImg[this.index].className = "first";

            }
        }




    }
})