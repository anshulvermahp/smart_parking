const exp = require("express")
const router = exp.Router()
const {mapPage} = require("../components/map")
const Parking = require("../models/parking");
// router.post("/map", mapHandler)
router.get("/map", mapPage)


router.get("/parking", async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  const radius = 0.4;
 // approx 2 km

  const parking = await Parking.find({
    latitude: { $gte: lat - radius, $lte: lat + radius },
    longitude: { $gte: lon - radius, $lte: lon + radius }
  });

  res.json(parking);
});



module.exports = router