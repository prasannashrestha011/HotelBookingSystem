const jwt=require('jsonwebtoken');
const verifyToken=(req,res,next)=>{
    const token=req.headers['authorization'];
    console.log(token,"is token");
    if(!token) return res.status(404).send("token not found");
    jwt.verify(token,'apple123',(err,decoded)=>{
        if(err) 
            {
                console.log('failed to authenticate the user')
                return res.status(403).json({message:"failed to authenticate the user"});
            }
         
        req.user=decoded;
        next();
    })
}
module.exports={verifyToken};