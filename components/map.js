function mapPage(req,res)
{
   const area = req.query.area;
  res.render("map", { area });
}



module.exports = {
    mapPage
}