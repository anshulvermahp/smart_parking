const users  = require("../models/register")



async function newUser(req, res) {


    let data = req.body;
  if (!data) {

    res.send("Invalid Input!!!")
    
  }
  else{
    try {
      let newUser = await users.create({
        username: data.username,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
      })

      return res.status(201).send("You are registered✅")
    } catch (err) {
      // Handle Mongo duplicate key error
      if (err && err.code === 11000) {
        const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field'
        return res.status(409).send(`${field} already exists`)
      }

      // Generic server error
      console.error('Registration error:', err)
      return res.status(500).send('Server error during registration')
    }
  }


   console.log(newUser);
   
    

    
    
}

async function registerUserPage(req,res) {

    res.render("register")
    
}

module.exports =
{
     newUser,
     registerUserPage
}