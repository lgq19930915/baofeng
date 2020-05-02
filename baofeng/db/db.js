const mongoClient = require("mongodb").MongoClient;

let to = require("../middleware/awiat-to");

class Db {
    constructor(dbname) {
        this.url = "mongodb://127.0.0.1:27017";
        this.dbname = dbname;
    }
    // 数据库连接
    connect() {
        return mongoClient.connect(this.url)
    }
    //选择数据库dbname数据库名
    async selectDb(dbname) {
        let [err, client] = await to(this.connect()); //等一下结果，解构赋值
        if (err) throw err; //甩错误
        return client.db(this.dbname)
    }
    // 选择集合coll集合名
    async collection(coll) {
        let [err, db] = await to(this.selectDb()); //等一下结果，解构赋值
        if (err) throw err; //甩错误
        return db.collection(coll);
    }
    // 常规查询
    async find(coll, filter = {}) {
        let [err, collection] = await to(this.collection(coll));
        if (err) throw err; //甩错误
        return collection.find(filter).toArray();
    }
    // 分页查询
    async pageination({
        coll = "",
        filter = {},
        skip = 0,
        limit = 3,
    } = {}) {
        let [err, collection] = await to(this.collection(coll));
        if (err) throw err; //甩错误
        return collection
            .find(filter)
            .skip(skip).
        limit(limit)
            .toArray();
    }
    //查询总数量
    async count(coll, filter = {}) {
        let [err, collection] = await to(this.collection(coll));
        if (err) throw err; //甩错误
        return collection.countDocuments(filter);
    }
    //新增数据
    async insert(coll, doc = {}) {
        let [err, collection] = await to(this.collection(coll));
        if (err) throw err; //甩错误
        return collection.insertOne(doc);
    }
    // 更新数据
    async update(coll, filter = {}, data = {}) {
        let [err, collection] = await to(this.collection(coll));
        if (err) throw err;
        return collection.updateMany(filter, {
            $set: data
        });
    }
    //删除数据
    async delete(coll, filter) {
        let [err, collection] = await to(this.collection(coll));
        if (err) throw err; //甩错误
        return collection.deleteMany(filter);
    }
}
module.exports = Db;