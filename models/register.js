const mongoo = require("mongoose")

const NewUser = new mongoo.Schema(    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        email:
        {
            type:String,
            required: true,
            unique: true
        },
        password:
        {
            type: String,
            required: true
        },
        phoneNumber:
        {
            type: Number,
            unique: true
            
        }

       
    },
{
    timestamps: true
})

    const users  = mongoo.model("users", NewUser)

    module.exports = users;