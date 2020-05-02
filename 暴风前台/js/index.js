// bannerMain  banner内容
var bannerMain = document.getElementById("banner");
var bannerUl = bannerMain.getElementsByTagName("ul")[0];
var bannerP = bannerMain.getElementsByTagName("p")[0];
var bannerLi = bannerUl.getElementsByTagName("li");
var p_img = bannerP.getElementsByTagName("img");
var btn = bannerMain.getElementsByTagName("i");
var a = 0;
var vip_lbtn = document.getElementById("vip_lbtn");
var vip_rbtn = document.getElementById("vip_rbtn");
var vip_ul = document.getElementById("vip_ul");
var vip_li = vip_ul.getElementsByTagName("li");
var b = 0;
// 轮播图静态布局
ujiuye.ajax({
    "url": "https://localhost:3000/banner/",
    "type": "get",
    "success": function (res) {
        var bArr = res.data;
        // console.log(res.data);

        // 根据后台数据，创建对应标签
        var ulStr = "";
        var pStr = "";
        // for (var i = 0; i < bArr.length; i++) {
        //     ulStr += '<li><img src="' + bArr[i].big_img + '" alt=""></li>';
        //     pStr += '<img src=' + bArr[i].small_img + '>';
        // }
        bArr.forEach(banner => {
            ulStr += `<li>
            <img src='${banner.big_img}'/>
            </li>`;
            pStr += `<img src='${banner.small_img}'/>`
        })
        bannerUl.innerHTML = ulStr;
        bannerP.innerHTML = pStr;
        // 初始化样式
        bannerLi[0].style.opacity = 1;
        p_img[0].style.opacity = 1;
        // 划过下面图片，对应上面图片更换
        for (var i = 0; i < p_img.length; i++) {
            p_img[i].index = i;
            p_img[i].onmouseover = function () {
                for (var j = 0; j < p_img.length; j++) {
                    ujiuye.bufferMove(bannerLi[j], {
                        "opacity": 0
                    });
                    ujiuye.bufferMove(p_img[j], {
                        "opacity": 30
                    });
                    ujiuye.bufferMove(bannerLi[this.index], {
                        "opacity": 100
                    });
                    ujiuye.bufferMove(p_img[this.index], {
                        "opacity": 100
                    });
                }
            }
        }
        // 加定时器自动轮播
        var timer = setInterval(bannerLiAuto, 2000)
        // 循环换图函数 ht
        function ht() {
            for (var j = 0; j < p_img.length; j++) {
                ujiuye.bufferMove(bannerLi[j], {
                    "opacity": 0
                });
                ujiuye.bufferMove(p_img[j], {
                    "opacity": 30
                });
                ujiuye.bufferMove(bannerLi[a], {
                    "opacity": 100
                });
                ujiuye.bufferMove(p_img[a], {
                    "opacity": 100
                });
            }
        }

        function bannerLiAuto() {
            a++;
            if (a >= p_img.length) {
                a = 0;
            }

            ht();
        }
        // 移入鼠标停止自动轮播
        bannerMain.onmouseover = function () {
            clearInterval(timer);
        };
        // 移出鼠标开始自动轮播
        bannerMain.onpointerout = function () {
            timer = setInterval(bannerLiAuto, 2000)
        };
        // 左边按钮
        btn[0].onclick = function () {
            a--;
            if (a >= bannerLi.length) {
                a = 0;
            }
            if (a < 0) {
                a = 8;
            }
            ht();
        }
        // 右边按钮
        btn[1].onclick = function () {
            a++;
            if (a >= bannerLi.length) {
                a = 0;
            }
            ht();
        }

    }
})
// vip特权



for (var i = 0; i < vip_li.length; i++) {
    vip_li[i].style.backgroundPositionX = i * 200 + "px";
}
// 左边按钮
vip_lbtn.onclick = function () {
    b--;
    if (b < 0) {
        b = 5;
        vip_ul.style.left = "-1050px"
    }
    ujiuye.move(vip_ul, "left", 50, -218 * b)
}
// 右边按钮
vip_rbtn.onclick = function () {
    b++;
    if (b > 5) {
        b = 0
        vip_ul.style.left = "0px"
    }
    ujiuye.move(vip_ul, "left", 50, -218 * b)
}
// 推荐热门
//强力推荐

ujiuye.ajax({
    'url': 'https://localhost:3000/movie/0',
    'type': 'get',
    'success': function (res) {
        var div = document.getElementsByClassName('recommend')[0];
        var tjul = div.getElementsByTagName('ul')[0];
        tjul.innerHTML = ujiuye.showMove(res.data);
    }
})
//热映大片
ujiuye.ajax({
    'url': 'https://localhost:3000/movie/1',
    'type': 'get',
    'success': function (res) {
        var div = document.getElementsByClassName('recommend')[1];
        var ryul = div.getElementsByTagName('ul')[0];
        ryul.innerHTML = ujiuye.showMove(res.data);
    }
});