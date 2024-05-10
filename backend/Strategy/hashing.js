const bcrypt=require('bcrypt');
const saltRound=10;
const hash=async(password)=>{
    const salt=await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(password,saltRound);
}
const comparePassword=async(plain,hashed)=>{
    return  await bcrypt.compare(plain,hashed);
}
module.exports={hash,comparePassword}