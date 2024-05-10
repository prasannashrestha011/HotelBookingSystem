import axios from 'axios';
import {useState,useEffect} from 'react';
export default function Chart({username}){
    const [chartlist,setChartList]=useState([]);
    const fetchChart=async()=>{
        try{
            const response=await axios.get(`http://localhost:3004/get-chart/${username}`);
            await response.data;
            if(response.status!==200) throw new Error('failed to get the list');
            console.log(response.data);
            setChartList(response.data);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        fetchChart();
    },[])
    return(
        <div className='fixed ' style={{left:'80%',top:'15%'}}>
            
            <ul>
            <div className='bg-slate-200 rounded-lg'>
                <div className='text-customBlue-400 border-b-2 border-gray-500 w-full  flex justify-center'>Your Booking detail</div>
                    {chartlist.map((item,idx)=>(
                        
                        <li key={idx}>
                            
                        <div className='  w-56 flex flex-col items-start justify-start px-1 s text-purple-950 font-semibold border-b-2 border-gray-900'>
                        
                                <p> Room id:{item.room_id}</p>
                                <p> Room name:{item.room_name}</p>
                                <p>Room type:{item.room_type}</p>
                                <p>Room price$:{item.room_price}</p>
                                <p>Booking:{item.room_book_date}</p>
                        </div>
                            </li>
                    ))}
            </div>
            </ul>
        </div>
    )
}