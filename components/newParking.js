

const Parking = require("../models/parking");

// Helper function to extract lat/lon
function extractLatLon(mapLink) {
  // Matches @lat,lon from Google Maps URL
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = mapLink.match(regex);

  if (!match) return null;

  return {
    latitude: parseFloat(match[1]),
    longitude: parseFloat(match[2]),
  };
}

function newParkingPage(req, res) {

    res.render("newParking")
    
}


async function addArea(req, res) {
  try {
    const { name, mapLink, totalSlots, availableSlots } = req.body;

    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = mapLink.match(regex);

    if (!match) {
      return res.send("Invalid Google Maps link");
    }

    // Handle uploaded images (Cloudinary URLs)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path || file.url || (file.filename ? file.filename : ""));
    }

    await Parking.create({
      name,
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
      totalSlots,
      availableSlots,
      mapLink,
      images
    });

    res.redirect("/admin/add-parking");
  } catch (err) {
    let errorMsg = err && err.message ? err.message : String(err);
    console.error("Error adding parking area:", errorMsg, err && err.stack ? err.stack : "");
    res.status(500).send("An error occurred: " + errorMsg);
  }
}

module.exports =
{
    extractLatLon,
    newParkingPage,
    addArea
}
