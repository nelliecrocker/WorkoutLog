const router = require("express").Router()
const { UserModel } = require("../models")

router.post("/register", async (req, res) => {
    UserModel.create({
        username: "user@email.com",
        password: "password1234"
    })
})
module.exports = router