const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin_index");
});

module.exports = router;