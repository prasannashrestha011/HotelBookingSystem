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
        auth.status==200 || userLog==200 ? <Navigate to="/home" />: 
       <div className='w-full h-svh ' style={{backgroundColor:'#4100FF'}}>

         <center>
        <p className='text-4xl text-blue-200'>Please sign in</p>

        <form onSubmit={LoginHandler} className='flex flex-col gap-4  h-80 justify-center items-center'>
        
               
                    <label for='username_input' >
                    <fieldset className='flex flex-col items-start'>
                        <h3 className='font-semibold text-2xl text-slate-100'>Username:</h3> 
                        <input type='text' 
                        value={username} 
                        onChange={(e)=>setUsername(e.target.value)} 
                        id="username_input"
                        style={{height:'40px',width:'250px',borderRadius:'5px'}}/>
                    </fieldset>
                </label>
            
                
                <label for='password_input' > 
                <fieldset className='flex flex-col items-start'>
                    <h3 className='font-semibold text-2xl text-slate-100'>Password:</h3>     
                    <input type='password' 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)} 
                    id='password_input'
                  
                    style={{height:'40px',width:'250px',borderRadius:'5px'}}/>
                    </fieldset>
                    </label>
           
            <button type='submit' className='bg-red-500 w-52 h-9 text-slate-200 rounded-lg mt-6 font-semibold hover:bg-gray-900 active:bg-gray-900' >Submit</button>
        </form>
    </center>
       </div>
    )
}