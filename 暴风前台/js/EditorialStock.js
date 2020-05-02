// 点播片库内容
var move = document.getElementById("move_content");
// 全局数据存储
var move_a = [];
// 静态布局
ujiuye.ajax({
    "url": "./static/playMove.json",
    "type": "get",
    "success": function (req) {
        moveArr = req;
        move_a = moveArr;
        // console.log(moveArr);
        addList(moveArr);
        // console.log(moveArr)

    }
});

//vip会员免费
// 中间导航获取
var center_nav = document.getElementById("center_nav");
// 所有排序按钮
var center_nav_a = center_nav.getElementsByTagName("a");
// console.log(center_nav_a);

// 全部
center_nav_a[0].onclick = function () {
    // 换样式
    center_nav_a[0].className = "a active";
    center_nav_a[1].className = "a ";
    center_nav_a[2].className = "a ";
    addList(move_a)
}
// vip折扣专享
center_nav_a[2].onclick = function () {
    // 换样式
    center_nav_a[2].className = "a active";
    center_nav_a[1].className = "a ";
    center_nav_a[0].className = "a ";
    var arr = move_a.filter(function (value) {
        return value.vip == 2
    })
    addList(arr)
}
//点击VIP会员免费
center_nav_a[1].onclick = function () {
    // 换样式
    center_nav_a[1].className = "a active";
    center_nav_a[0].className = "a";
    center_nav_a[2].className = "a";
    // console.log(move_a);
    var arr = move_a.filter(function (value) {
        return value.vip == 1
    })
    // console.log(arr);
    addList(arr);
}
// 点击最近更新
var bottom_nav = document.getElementById("bottom_nav");
var bottom_nav_a = bottom_nav.getElementsByTagName("a");
// console.log(bottom_nav_a[0])
bottom_nav_a[0].onclick = function () {
    bottom_nav_a[0].className = "active";
    bottom_nav_a[1].className = "";
    move_a.sort(function (a, b) {
        return Date.parse(b.date) - Date.parse(a.date);
    })
    addList(move_a);

}
// 点击最受欢迎
// console.log(bottom_nav_a[1]);
bottom_nav_a[1].onclick = function () {
    bottom_nav_a[1].className = "active";
    bottom_nav_a[0].className = "";
    move_a.sort(function (a, b) {
        return b.score - a.score
    })
    addList(move_a);
}

// 内容写入函数
function addList(arr) {

    move.innerHTML = "";
    var str = "";
    // console.log(arr);
    for (var i = 0; i < arr.length; i++) {
        str += '<div class="content">';
        str += '<a href="#">';
        str += ' <img src="' + arr[i].img + '" alt="">';
        if (arr[i].vip == 3) {
            str += ' <span class="i1" style="background-image: url(../images/image/vip-tips.png);background-position: 0 -20px;"></span>';
            str += '<span class="i2">超清</span>';
        } else if (arr[i].vip == 2) {
            str += ' <span class="i1" style="background-image: url(../images/image/vip-tips.png);background-position: 0 0;"></span>';
            str += '<span class="i2">高清</span>';
        }
        else if (arr[i].vip == 1) {
            str += ' <span class="i1" style="background-image: url(../images/image/vip-tips.png);background-position: -110px 0;"></span>';
            str += '<span class="i2">标清</span>';
        }
        str += '<span class="i3">' + arr[i].title + '</span>';
        str += '<span class="i4">' + arr[i].detail + '</span>';
        str += '<span class="i5">' + arr[i].score.slice(0, 1) + '.<i>' + arr[i].score.slice(2, 3) +
            '</i></span>'
        str += '</div>';
    }

    move.innerHTML = str;
}
