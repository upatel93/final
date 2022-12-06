const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let finalSchema = new Schema({
    "email": {
        "type":String,
        "unique":true
    },
    "password": String
});

let pwd = "VkBU1ZayKCGMGF9R";
let url = `mongodb+srv://upatel69:${pwd}@senecaweb.uclzryc.mongodb.net/final?retryWrites=true&w=majority`
let User;

let isValid = (string)=>{
    let valid = true;
    if(string){
       if(string.trim().length !== 0)
       return valid;
    }
    return !valid;
}



module.exports.startDB = ()=>{
    return new Promise((resolve,reject)=>{
        let db = mongoose.createConnection(url, {useNewUrlParser: true, useUnifiedTopology: true});

        //Checking if the connection is established
        db.on('error',(error)=>{ 
            console.log(`Error..!! - ${error}`);
            reject(error);
        });

        //If connection is established
        db.once('open',()=>{
            User = db.model("users",finalSchema); // Registering userSchema to users
            console.log("DB connection successful.");
            resolve();
        });
 
    })
}


module.exports.register = (user)=>{

    return new Promise((resolve, reject)=>{
        if(!isValid(user.email) || !isValid(user.password)){
            reject("Error: email or password cannot be empty.");
            return;
        }

        let newUser = User(user);
            console.log(newUser);
            newUser.save()
            .then(()=>resolve())
            .catch((error)=>{
                if(error.code == 11000){
                    reject(`${newUser.email} exists already`);
                    return;
                }else{
                    reject(`There was an error while creating user : ${error}`);
                    return;
                }
            })

    })
};


module.exports.signIn = (user)=>{
    return new Promise((resolve,reject)=>{
        User.findOne({ email : user.email }).exec()
        .then((foundUser)=>{
            if(foundUser){
                if(user.password === foundUser.password){
                    console.log(foundUser);
                    resolve();
                }
                else{
                    reject(`Incorrect password for user ${user.email}`);
                }
            }
        }).catch((error)=>{
            reject(`Cannot find the user ${user.email}`);
        })
    })
}