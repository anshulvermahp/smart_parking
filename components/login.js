const users = require("../models/register")


async function loginHandler(req, res) {

    let {email, password} = req.body

    

    if (!email && !password) {

        res.send("Please try again")
        
    }
    else
    {
        try {

       let userdata = await users.findOne({email, password})
      if (userdata) {
         res.render("home")
      }
      else
      {
        res.send("invalid Credentials");
      }
            
        } catch (error) {
            console.log("something heppened wrong please try agin later!!");
            
        }
    }

    
    
}

function loginPage(req, res)
{
    res.render("login")
}
module.exports = 
{
    loginHandler,
    loginPage
}