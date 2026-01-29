const moongo = require("mongoose");



async function connectDB(url) {
    
return await moongo.connect(url).then(()=> {
        try {
             console.log("DB IS CONNECTED")
        } catch (error) {

            console.log("DB is failed to connect", error);
            
            
        }
    });

}

module.exports = connectDB;