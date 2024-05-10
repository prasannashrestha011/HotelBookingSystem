import React,{useState} from 'react';
import axios from 'axios';
import { Navigate ,useLocation} from 'react-router-dom';
import AuthHook from '../hooks/AuthHook';
export default function LoginPage(){
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const {auth,setAuth}=AuthHook();
  
    const userLog=window.localStorage.getItem('login_status');
    const LoginHandler=async(e)=>{
        e.preventDefault();
        const response=await axios.post(process.env.REACT_APP_AUTHENTICATION_API,{
            username,password
        });
        console.log(response.status);
        if(response.status!=200){
            console.log('failed to fetch the data');
            return ;
        }
        console.log(response.data,"is the access token");
        window.localStorage.setItem('access_token',response.data);
        process.env.ACCESS_TOKEN=response.data;
        setAuth({status:response.status});
        window.localStorage.setItem('login_status',response.status);
        window.localStorage.setItem('username',username);
        console.log("Authentication successfull");
        console.log(`${userLog} is lcal storage`);
    }
    return(
        auth.status==200 || userLog==200 ? <Navigate to="/home" />: <center>
        <h1>Please Sign in</h1>

        <form onSubmit={LoginHandler}>
        <label for='username_input'>
        <h3>Username:</h3> 
        <input type='text' 
        value={username} 
        onChange={(e)=>setUsername(e.target.value)} 
        id="username_input"/>
        </label>
        <label for='password_input'> 
        <h3>Password:</h3>     
            <input type='password' 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            id='password_input' />
            </label>
            <button type='submit'>Submit</button>
        </form>
    </center>
    )
}