

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("get student");
});

router.post("/", (req, res) => {
    res.send("post student");
});

module.exports = router;