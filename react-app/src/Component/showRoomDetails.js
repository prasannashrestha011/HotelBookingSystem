import axios from 'axios';
import {useState,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
export default function ShowRoomDetails(props){
    const location=useLocation();
    const room_id=location.state.room_id;
    const [roomlist,setRoomList]=useState({});
    const access_token=window.localStorage.getItem('access_token');
    const fetchRoomDetails=async()=>{
            try{
                const response=await axios.get(`http://localhost:3004/room-details/${room_id}`,{
                  headers:{
                    Authorization:`${access_token}`
                  }
                });
                if(response.status!=200) throw new Error('failed to get the data');
                setRoomList(response.data);
            }catch(err){
                console.log(err);
            }
    }

    useEffect(()=>{
        fetchRoomDetails();
    },[]);
    return(
        <div className='flex flex-col  items-center h-screen border border-black bg-customBlue' style={{ margin: 'auto 0' }}>
       
        <div className='flex flex-col items-center mt-2 text-2xl font-semibold  text-white'>
          <img src={`http://localhost:3004/images/${roomlist.room_image_path}`} style={{ width: '40%', borderRadius:'35px' }} />
          <div className='border border-black flex flex-col pl-2'>
            <span >Room id:{roomlist.room_id}</span>
            <span >Room name:{roomlist.room_name}</span>
            <span>Room type:{roomlist.room_type}</span>
            <span>Room price:${roomlist.room_price}</span>
            <span>Room status:{roomlist.room_availability?<span>Available</span>:<span className='text-red-600'>Not Available</span>}</span>
            <span>Room Description:{roomlist.room_description}</span>
          </div>
        </div>
      </div>
      
    )
}