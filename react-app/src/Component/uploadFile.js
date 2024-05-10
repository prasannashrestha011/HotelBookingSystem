import axios from 'axios';
import React,{useState} from 'react';
export default function UploadFile(){
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const fetchFileHandler=async(e)=>{
        e.preventDefault();
        const response=await axios.get(`http://localhost:3004/create-transaction-document/${username}/${email}`,
           { responseType:'blob'}
        );
        await response.data;
        if(response.status!=200) console.log('error occured');
        const url=window.URL.createObjectURL(new Blob([response.data]));
        const a=document.createElement('a');
        a.href=url;
        a.download='exe.xlsx';
        document.body.append(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.remove(a);
    }
    return(
        <form onSubmit={fetchFileHandler}>
            <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <button type='submit'>Submit</button>
        </form>
    )
}