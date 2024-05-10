const mongoose=require('mongoose');
const Schema=mongoose.Schema({
    UserName:{
        type:String,
        require:true,
        unique:true,
    },
    Password:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        unique:true,
        require:true
    },
    Contact:{
        type:Number,
        require:true,
    },
    Role:{
        type:String,
        required:true
    },
    RoomBooked:[{
        room_id:Number,
        room_name:String,
        room_price:Number,
        room_type:String,
        room_book_date:String,
    }]

})
module.exports=mongoose.model('UserDetails',Schema);