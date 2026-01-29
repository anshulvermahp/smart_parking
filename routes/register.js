const exp = require("express");
const router = exp.Router()

const { newUser, registerUserPage } = require("../components/register")

router.post("/register", newUser)
router.get("/register", registerUserPage)

module.exports = router