const exp = require("express");
const router = exp.Router()
const {newParkingPage, addArea} = require("../components/newParking")
const upload = require("../config/multer");
router.get("/add-parking", newParkingPage)
router.post("/add-parking", upload.array("images", 5), addArea)

module.exports = router