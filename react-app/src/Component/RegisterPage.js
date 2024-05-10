import React,{useState} from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
export default function RegisterPage(){
    const [username,setUserName]=useState('');
    const [password,setPassword]=useState('');
    const [email,setEmail]=useState('');
    const [contact,setContact]=useState(0);
    const [isregister,setIsRegister]=useState(false);
    const submitHandler=async(e)=>{
        e.preventDefault();
       try{
            const formData=new FormData();
            formData.append('username',username);
            formData.append('password',password);
            formData.append('email',email);
            formData.append('contact',contact);
            formData.append('role','USER');
            const response=await axios.post(process.env.REACT_APP_REGISTRATION_API,formData);
            await response.data;
            if(response.status!==200) throw new Error('failed to register the user');
            console.log('user register sucessfully');
            setIsRegister(true);
       }catch(err){
        console.log(err);
       }
    }
    return(
        <>
        {isregister?<Navigate to='/login' />:<form onSubmit={submitHandler}>
            <p>Username:</p>
        <input type="text" value={username} onChange={(e)=>setUserName(e.target.value)} />
        <p>Password:</p>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <p>Email:</p>
        <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} />
        <p>Contact Number:</p>
        <input type="number" value={contact} onChange={(e)=>setContact(e.target.value)} />
        <button type="submit">Submit</button>
        </form>}
        </>
    )
}