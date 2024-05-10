import axios from "axios";
import { Key } from "lucide-react";
import { useState,useEffect } from "react";
export default function BookTracking(){
    const [isbookdetails,setIsBookDetails]=useState([]);

    const access_token=window.localStorage.getItem('access_token');
    const fetchBookDetails=async()=>{
        try{
        const response=await axios.get('http://localhost:3004/get-all-charts',{
            headers:{
                Authorization:`${access_token}`
            }
        });
        await response.data;
        if(response.status!=200) throw new Error('failed to fetch the url');
        setIsBookDetails(response.data);
        }catch(err){
            console.log(err);
        }
    }
    const fileHandler=async()=>{
        try{
           
        
             const response=await axios.get('http://localhost:3004/create-charts-workbook',{
                responseType:'blob',
                headers:{
                    Authorization:`${access_token}`
                }
            });
         
            if(response.status!==200) throw new Error('failed to fetch the url');
            const url=window.URL.createObjectURL(response.data);
            const a=document.createElement('a');
            a.href=url;
            a.download='chartDocument.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        fetchBookDetails();
    },[])
    return(
     
        <center>
            <button className="bg-blue-600 text-slate-100 w-24 rounded-sm text-center"
            onClick={()=>fileHandler()}
            > Download</button>
                <table className="border border-gray-950 " style={{width:'50%'  ,textAlign:'center',marginTop:'30px' }} >
                <thead className="border border-black" >
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Room booked</th>
                    </tr>
                </thead>
                <tbody >
                   
                   {isbookdetails.map((item,idx)=>(
                    <tr style={{width:'20%', border:'1px solid black'}}>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.contact}</td>
                        <td>
                            <ul>
                            {item.roombooked.map((item,idx)=>(
                              <li key={idx} className="border border-gray-800 flex flex-col">
                                    
                                  <div className="flex  gap-2">
                                    <span>{item.room_name}</span>
                                    <span> {item.room_book_date}</span>
                                  </div>
                                    
                                </li>
                           
                            ))}
                            </ul>
                        </td>
                    </tr>
                   ))}
                   
                </tbody>
            </table>
        </center>
       
    )
}