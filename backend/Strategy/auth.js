const passport=require('passport');
const Strategy=require('passport-local');
const Database=require('../Schema/UserSchema');
const jwt=require('jsonwebtoken');
const {comparePassword}=require('../Strategy/hashing.js');
passport.use(new Strategy(async(username,password,done)=>{
    try{
        const findUser=await Database.findOne({UserName:username});
      
        if(!findUser) throw new Error("User not found");
        if(!comparePassword(password,findUser.Password)) throw new Error("Incorrect Password");
        console.log(`${findUser.UserName} authenticated`);
     
        done(null,findUser.UserName)
    }catch(err){
        console.log(err)
        
    }
}))
passport.serializeUser((user,done)=>{
   
 
    done(null,user);
})
passport.deserializeUser(async(id,done)=>{
    
    
   
    done(null,id);
})
module.exports=passport