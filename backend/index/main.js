const express=require('express');
const app=express();
const cors=require('cors');
const jwt=require('jsonwebtoken');
const {verifyToken}=require('../jwt/jwtcomp.js');
//cross origin confirguration
app.use(cors(
    {
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
require('dotenv').config();//env configuration
const session=require('express-session');
const passport=require('passport');
const Strategy=require('passport-local').Strategy;
require('../Strategy/auth.js');
//#mongo db setup
const mongoose=require('mongoose');
const userSchema=require('../Schema/UserSchema.js');
const roomSchema=require('../Schema/RoomSchema.js');
const {hash}=require('../Strategy/hashing.js');
//#file storage
const multer=require('multer');
//#email sender configuration
const nodemailer=require('nodemailer');
const UserSchema = require('../Schema/UserSchema.js');
const RoomSchema = require('../Schema/RoomSchema.js');
const excelJS=require('exceljs');
const genImgId=Math.ceil(Math.random()*1000);
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        return cb(null,'../public/images');
    },
    filename:(req,file,cb)=>{
        return cb(null,`${genImgId}-${file.originalname}`)
    }
})
const upload=multer({storage});
const path=require('path');
const publicImagesPath = path.join(__dirname, '../public');
app.use(express.static(publicImagesPath));
const PORT=3004;
app.use(session({
    secret:"apple_123",
    saveUninitialized:false,
    resave:false
}))
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb://localhost:27017/HotelManagementSystem').then(()=>{
    console.log("Database connected")
}).catch((err)=>console.log(err));

app.post('/register',upload.none(),async(req,res)=>{

    const {username,password,email,contact,role}=req.body;
    try{
        const newUser=userSchema({
            UserName:username,
            Password:await hash(password),
            Email:email,
            Contact:contact,
            Role:role,
            RoomBooked:[]
        });
        await newUser.save();
        console.log(`${username} was added to the userDetails`);
        res.status(200).send("Account created");
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
})

app.post('/authentication',passport.authenticate('local'),(req,res)=>{
    const {username}=req.body;
    const payload={
        id:Math.ceil(Math.random()*999999),
        username:username
    };
    const secretKey="apple123";
    const token=jwt.sign(payload,secretKey,{expiresIn:'1h'});
    res.status(200).send(token);
})
app.get('/getUser/:username',verifyToken,async(req,res)=>{
    const {username}=req.params;
   try{
    const findUser=await userSchema.findOne({UserName:username});
    if(!findUser) throw new Error('User not found');
    res.send(findUser);
   }catch(err){
    console.log(err);
    res.sendStatus(404);
   }

})
app.get('/employees',verifyToken,async(req,res)=>{
    const findEmployees=await userSchema.find({Role:"EMPLOYEE"});
    res.send(findEmployees);
})
app.get('/get-room-detail',verifyToken,async(req,res)=>{
    const roomDetails=await roomSchema.find({});
    console.log('data sent from get-room-detail');
   
    res.status(200).send(roomDetails);
})
app.post('/upload-room-detail',upload.single('room_image'),async(req,res)=>{
    const {room_name,room_type,room_availability,room_price,room_description}=req.body;
    const room_image=req.file;
    console.log(req.body)
    const room_id=Math.floor(Math.random()*1000000);
    try{
        const savedRoomDetail=roomSchema({
            room_id:room_id,
            room_name:room_name,
            room_type:room_type,
            room_image_path:`${genImgId}-${room_image.originalname}`,
            room_availability:room_availability,
            room_price:room_price,
            room_description:room_description,
        });
        await savedRoomDetail.save();
        console.log(`${room_name} was added to the database`);
        res.sendStatus(200)
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
})
app.delete('/delete-room-detail/:id',async(req,res)=>{
    const {id}=req.params;
    const findRoom=await roomSchema.deleteOne({room_id:id});
   try{
    if(findRoom.deletedCount==1){
        res.status(200).send(`Room ${id} deleted successfully `);
    }else{
        res.status(404).send(`Room ${id} not found`);
    }
   }catch(err){
    console.log(err);
    res.status(500).send("failed to delete the room detail");
   }
})
app.patch('/edit-room-detail/:id',upload.single('newimg'),async(req,res)=>{
    const {id}=req.params;
    const newimg=req.file;
    
    const {name,price,available_status,type}=req.body;
    try{
        const updateRoom=await roomSchema.updateOne({room_id:id},{$set:{room_name:name,room_price:price,room_availability:available_status,room_type:type,room_image:{file_name:newimg.originalname,file_type:newimg.mimetype,encodedFile:newimg.buffer.toString('base64')}}});
        if(updateRoom){
            res.status(200).send('details updated');

        }else{
            throw new Error('failed to update the details');
            
        }
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
})
app.patch('/room-book/:id/:username',async(req,res)=>{
    const {id,username}=req.params;
    const {email_address,room_book_date}=req.body;
    console.log(email_address)
    try{
        const findRoom=await roomSchema.findOne({room_id:id});
        const client_account=await UserSchema.findOne({UserName:username});
        if(!findRoom) throw new Error('User not Found');
        const room_book_status=findRoom.room_books.get(username);
        if(room_book_status){
            findRoom.room_books.delete(username);
           //finding index of object in the array
           const index=client_account.RoomBooked.findIndex(room=>room.room_id==id);
           client_account.RoomBooked.splice(index,1);
            console.log(`book status removed on ${id}`);
        }else{
            findRoom.room_books.set(username,true);
            const {room_name,room_price,room_type}=findRoom;
           if(client_account.RoomBooked){
            client_account.RoomBooked.push({
                room_id:id,
                room_name,
                room_price,
                room_type,
                room_book_date
            })
           }else{
            client_account.RoomBooked.push({room_id:id,room_name,room_price,room_type,room_book_date})
            await client_account.save();
           }
            
           
            
            console.log(`new book added on ${id}`);
            let transporter=nodemailer.createTransport({
                service:'Gmail',
                host:'smtp.gmail.com',
                port:587,
                secure:false,
                auth:{
                    user:'shresthaprashanna27@gmail.com',
                    pass:'tmnd kjem kpon nxiu'
                }
            })
            let mailOptions={
                from:`Manager <shresthaprashanna27@gmail.com>`,
                to:`${email_address}`,
                subject:`Room book ${id}`,
               
                html:`
                <div style="display:flex; flex-direction:column">
                ${username}, you have requested to book room ${id}
                <img src="https://picsum.photos/seed/picsum/200/300" alt="img" style="width:120px;border-radius:15px;margin-left:-50px;" />
                </div>
                `
                
            }
            transporter.sendMail(mailOptions,(err,info)=>{
                if(err){
                    return res.status(400).send('failed to send the email');
                }
                return console.log('email sent',info.response);
              
            })
        }
        await findRoom.save();
        await client_account.save();
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }

})
app.get(`/room-details/:room_id`,verifyToken,async(req,res)=>{
    const {room_id}=req.params;
    try{
        const findRoom=await RoomSchema.findOne({room_id:room_id});
        if(!findRoom) throw new Error(`${id } not Found`);
        res.status(200).send(findRoom);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }

})
app.get('/get-all-charts',verifyToken,async(req,res)=>{
    try{
       const clients=await UserSchema.find({
        RoomBooked:{$ne:null}
       })
        const modified_clients=clients.map((item)=>({
            username:item.UserName,
            email:item.Email,
            contact:item.Contact,
            roombooked:item.RoomBooked,
        }))
        res.status(200).send(modified_clients);
    }catch(err){
        res.sendStatus(500);
    }
})
app.get('/create-charts-workbook',verifyToken,async(req,res)=>{
    
    const excelData=await UserSchema.find({RoomBooked:{$ne:null}});
    console.log(excelData);
    try{
        const workbook=new excelJS.Workbook();
        const worksheet=workbook.addWorksheet('chart-sheet');
        
        worksheet.columns=[
            {headers:'Username',key:'Username',width:15.84},
           { headers:'Email',key:'Email',width:33.43},
            {headers:'Contact',key:'Contact',width:20.57},
           { headers:'Booking_Details',key:'Booking_Details',width:32.00}
        ];
        worksheet.addRow({
            Username:"Username",
            Email:"Email",
            Contact:"Contact",
            Booking_Details:"BookingDetails"
        })
        worksheet.getRow(1).eachCell((cell)=>{
            cell.font={bold:true}
        })
        excelData.forEach((user)=>{
           user.RoomBooked.forEach((item)=>{
            worksheet.addRow({
                Username: user.UserName,
                Email: user.Email,
                Contact: user.Contact,
                Booking_Details: `${item.room_id}-${item.room_type}-$${item.room_price}-${item.room_book_date}`
           })
            });
        })
        //generate excelfile
        const buffer=await workbook.xlsx.writeBuffer();
        res.set('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.set('Content-Disposition','attachment; file=bookchart');
        res.send(buffer);
    }catch(err){
        console.log(err);
        res.send(500);
    }
})
app.get('/get-chart/:username/',verifyToken,async(req,res)=>{
    const {username}=req.params;
   try{
    const client_account=await UserSchema.findOne({UserName:username});
    if(!client_account) throw new Error('not found')
    res.status(200).send(client_account.RoomBooked);
    
   }catch(err){
    res.sendStatus(404);
   }

})

app.listen(PORT,()=>{
    console.log(`Server running on PORT:${PORT}`);
})
