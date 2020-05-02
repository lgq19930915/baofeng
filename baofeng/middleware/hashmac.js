let crypto = require("crypto");
//加密模块 ，秘钥默认为baofeng
function encryption(data, key = "baofeng") {
    let hmac = crypto.createHmac("sha1", key);
    hmac.update(data);
    return hmac.digest("hex")
}
module.exports = encryption;