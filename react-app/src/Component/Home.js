import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import '../css/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { X } from 'lucide-react';
import { Home } from 'lucide-react';
import ConfirmModel from '../Model/confirmModel';
import Chart from '../Model/Chart';
import HotelDetailPage from './hotelDetailpage';
export default function HomePage(){
    const navigate=useNavigate();
    const [fetchdata,setFetchData]=useState([]);
    const [fetchuser,setFetchUser]=useState({});
    const [addroom,setAddRoom]=useState(false);
    const[roomname,setRoomName]=useState('');
    const [roomtype,setRoomType]=useState('');
    const[roomimg,setRoomImg]=useState(null);
    const [roomstatus,setRoomStatus]=useState(false);
    const [roomprice,setRoomPrice]=useState(0);
    const [roomdescription,setRoomDescription]=useState('');
    const [editpanel,setEditPanel]=useState(false);
    const [currEditIndex,setCurrEditIndex]=useState('');
    const [newname,setNewName]=useState('');
    const [newtype,setNewType]=useState('');
    const [newimg,setNewImg]=useState('');
    const [newstatus,setNewStatus]=useState('');
    const [newprice,setNewPrice]=useState('');
    const [showConfirmPanel,setShowConfirmPanel]=useState({});
    const [isbookconfirm,setIsBookConfirm]=useState(false);
    const [showchartpanel,setShowChartPanel]=useState(false);
    const username=window.localStorage.getItem('username');

    const access_token=window.localStorage.getItem('access_token');
    const logoutHandler=()=>{
      
        window.localStorage.removeItem('login_status');
        navigate('/');
        window.location.reload();
    }
    const submitHandler=async(e)=>{
      e.preventDefault();
      const formData=new FormData();
      formData.append('room_name',roomname);
      formData.append('room_type',roomtype);
      formData.append('room_availability',roomstatus);
      formData.append('room_price',roomprice);
      formData.append('room_image',roomimg);
      formData.append('room_description',roomdescription);

     try{
      const response=await axios.post(process.env.REACT_APP_UPLOAD_ROOM_API,formData);
      if(response.status !==200) throw new Error('failed to fetch the data');
      await response.data;
      console.log(response.data);
      fetchRoomDetails();
      setRoomName('');
      setRoomType('single');
      setRoomStatus(false);
      setRoomPrice('');
      
     }catch(err){
      console.log(err)
     }

    }
    const fetchUser=async()=>{
      try{
        const response=await axios.get(`http://localhost:3004/getUser/${username}`,{
          headers:{
            Authorization:`${access_token}`
          }
        });
        await response.data;
        if(response.status!==200) throw new Error('failed to fetch the data');
        console.log(response.data);
        setFetchUser(response.data);
      }catch(err){
        console.log(err);
      }
    }
    const fetchRoomDetails=async()=>{
      console.log(process.env.REACT_APP_GET_ROOM_DETAILS_API,'Is the env api');
      try{
        const response=await axios.get(process.env.REACT_APP_GET_ROOM_DETAILS_API,{
          headers:{
            Authorization:`${access_token}`
          }
        });
        if(response.status!==200) throw new Error("Failed to get the data");
        const  result=await response.data;
       
        console.log(result);
      
       
        setFetchData(result);
      }catch(err){
        console.log(err);
        return;
      }
  
    }
    const editRoomDetails=async(id)=>{
      const formData=new FormData();
      formData.append('name',newname);
      formData.append('price',newprice);
      formData.append('available_status',newstatus);
      formData.append('type',newtype);
      formData.append('newimg',newimg);
      try{
        const response=await axios.patch(`http://localhost:3004/edit-room-detail/${id}`,formData);
        await response.data;
        if(response.status!=200) throw new Error('failed to delete the data');
        fetchRoomDetails();
        setNewName('');
        setNewPrice('');
        setNewStatus(false);
        setNewType('');
        setNewImg('');
        setEditPanel(false);
      }catch(err){
        console.log(err);
      }
    }
    const deleteRoomDetails=async(id)=>{
      try{
        const response=await axios.delete(`http://localhost:3004/delete-room-detail/${id}`);
      await response.data;
      if(response.status==200){
        console.log('data delete successfully');
        fetchRoomDetails();
      }else{
        throw new Error("failed to delete the data");
      }
      }catch(err){
        console.log(err);
      }
    }
    const editPanelHandler=async(item)=>{
      setCurrEditIndex(item.room_id);
      setNewName(item.room_name);
      setNewPrice(item.room_price);
      setNewStatus(item.room_availability);
      setNewType(item.room_type);
      setNewImg(item.room_image);
      if(editpanel){
        setEditPanel(false);
      }else{
        setEditPanel(true);
      }
    }
    
    const roomBookHandler=async(id,username,email,date)=>{
   
      try{
        const response=await axios.patch(`http://localhost:3004/room-book/${id}/${username}`,{email_address:email,room_book_date:date});
        await response.data;
        if(response.status!==200) throw new Error('failed to book the route');
        console.log('room booked');
        fetchRoomDetails();
      }catch(err){
        console.log(err);
      }
    }
    useEffect(()=>{
        fetchRoomDetails();
        fetchUser();
    },[])
    return (
      <div className='bg-customBlue  home-main-body'>
        <div className='mx-4 min-h-screen'>
      <nav className='flex font-serif items-center justify-between text-xl nav-buttons'>
        <div>
        <button 
          className=' w-25 h-10 rounded-lg px-3  my-2 text-slate-300 hover:bg-blue-950 '
          onClick={()=>{
            logoutHandler();
            }}>Logout</button>
       <button className='  w-28 h-10 rounded-md text-purple-50 '
          onClick={()=>{
            if(showchartpanel){
              setShowChartPanel(false);
            }else{
              setShowChartPanel(true);
            }
          }}>
            Chart
            </button>
          {fetchuser.Role=="Admin"?<button 
          className='w-25 h-10 rounded-lg px-3 my-2 text-slate-300 hover:bg-blue-950'
          onClick={()=>{
            if(addroom){
              setAddRoom(false);
            }else{
              setAddRoom(true);
            }
          }}
          >Add Room</button>
          :""
          }
        </div>
            <span className='text-white font-inter pr-8 font-semibold text-2xl'>{fetchuser.UserName}/{fetchuser.Role=="Admin"?
                                                                                          <span className='text-red-500 '>{fetchuser.Role}</span>:
                                                                                          <span className='text-purple-400 font-semibold'>{fetchuser.Role}</span>}</span>
      </nav>
            
     {addroom?  <div className='flex gap-8'>
                {
                                       
                                        <form onSubmit={submitHandler} encType='multipart/form-data'>
                    <div className='flex gap-2'>
                      <input type='text' placeholder='room name' value={roomname} onChange={(e)=>setRoomName(e.target.value)} className=' border border-gray-400 rounded-md px-1 bg-customBlue_2'/>
                      <select value={roomtype} onChange={(e)=>setRoomType(e.target.value)} defaultValue="single" className='border border-gray-400 bg-customBlue_2 text-white rounded-lg'>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="triple">Triple</option>
                      </select>
                      <input type='file'  onChange={(e)=>setRoomImg(e.target.files[0])} />
                      <input type='number' value={roomprice} onChange={(e)=>setRoomPrice(e.target.value)} className='border border-gray-400 rounded-md bg-customBlue_2 text-white  '/>
                      <select value={roomstatus} onChange={(e)=>setRoomStatus(e.target.value)} className='border border-gray-400  bg-customBlue_2 text-white  rounded-lg'>
                        <option value="true">True</option>
                        <option value="false">False</option>
                        </select> 
                        <input type='string' value={roomdescription} onChange={(e)=>setRoomDescription(e.target.value)} className='border border-gray-400 bg-customBlue_2 text-white  rounded-lg'/>
                        <button type='submit' className='bg-red-600 text-white font-inter px-6 rounded-md active:bg-black'>Submit </button>

                    </div>
                    </form>
                
                }
           
            
       </div>:""}
       {showchartpanel?<Chart username={username}/>:""}
          <div className=" header-template text-3xl my-3 flex items-center text-white ml-56 gap-3 ">
          <Home/>
            <span className='text-white text-3xl font-inter font-bold   '>Home </span>
           
            </div>
            
            <div className='body-main'>
            <div className=' node_container border border-gray-700' >
          <ul >
           
          <div className='room_details_main'>
            {fetchdata.map((item,idx)=>{
                return(
                  <>
                  
                    <div className='room_details_node' >
           
                            <li key={idx} >
                    <div className='room_details_header'>
                    <h3>
            
                 <p className=' text-2xl mx-3 text-white font-semibold'>{item.room_name}</p>
                 
                  </h3>
                    <div className='flex  gap-1'>
                          {fetchuser.Role =="Admin"?<>
                          <button className='text-white text-2xl active:text-red-300' onClick={()=>deleteRoomDetails(item.room_id)}>
                        <FontAwesomeIcon icon={faTrashAlt}  />
                        </button>
                        <button 
                        className='text-white'
                        onClick={()=>{
                          editPanelHandler(item);
                        }}>
                          Edit
                        </button>
                          </>:""}
                    </div>
                    </div>
                    <div className='room_second_container border border-gray-800 px-1' onDoubleClick={()=>navigate('/room-details',{state:{room_id:`${item.room_id}`}})}>
                    <div>
                 <div className='room_image_container  border-b-2 border-gray-800'>
                 <img src={`http://localhost:3004/images/${item.room_image_path }`} className='room_image'/>
                 </div>
                 {/* confirm pop panel*/}
                 {showConfirmPanel.status?<ConfirmModel 
                                          confirmStates={{setIsConfirm:setIsBookConfirm,isConfirm:isbookconfirm}}
                                          onClose={()=>setShowConfirmPanel({status:false})} 
                                          onConfirm={(date)=>roomBookHandler(showConfirmPanel.id,showConfirmPanel.userName,showConfirmPanel.email,date)}/>
                                         
                                          :""}
                 
                  </div>
                    <div className='room_info text-lg pb-3 text-white font-sans w-full px-1 '>
                    <div className='border-b-2 border-gray-800 mb-1 '>
                    <p className='border-b-2 border-gray-800 mb-1 '>  {item.room_type}</p>
                    <p className='border-b-2 border-gray-800 mb-1 '>${item.room_price}</p>
                 
                    {item.room_availability?<p className='text-green-800'>Available</p>:<p className='text-red-600'>Not Available</p>
                    }
                    </div>
                    
                    {item.room_books.hasOwnProperty(username)?<button className="bg-green-500 px-2 rounded-md  text-white" onClick={()=>roomBookHandler(item.room_id,username)}>Booked</button>:
                                                              <button  className="bg-red-500 px-2 rounded-md  text-white" onClick={()=>setShowConfirmPanel({status:true,id:item.room_id,userName:username,email:fetchuser.Email})}>Book</button>}
                    
                    </div>
                    </div>
                    </li>
                        </div>
                        </>
                )
            })}
             </div>
            
          </ul>
          </div>
          {editpanel?<>
          <div className='edit_container'>
          <input type='text' placeholder='name' value={newname} onChange={(e)=>setNewName(e.target.value)} />
          <input type='number' placeholder='price' value={newprice} onChange={(e)=>setNewPrice(e.target.value)}/>
          <input type='text' placeholder='type' value={newtype} onChange={(e)=>setNewType(e.target.value)}/>
          <input type='text' placeholder='status' value={newstatus} onChange={(e)=>setNewStatus(e.target.value)}/>
             <input type='file'  onChange={(e)=>setNewImg(e.target.files[0])} />
          <button onClick={()=>editRoomDetails(currEditIndex)}>Submit</button>
          </div>
          </>:""}

            </div>
        </div>
       <HotelDetailPage/>
        </div>
        
    )
}