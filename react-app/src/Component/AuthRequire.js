import React,{useEffect} from "react";
import AuthHook from "../hooks/AuthHook";
import { Navigate, Outlet ,useLocation} from "react-router-dom";
export default function AuthRequire(){
    const {auth,setAuth}=AuthHook();
    const location=useLocation();
    const userLog=window.localStorage.getItem('login_status');
    useEffect(()=>{
        if(auth.status==null){
            setAuth({status:401});
        }
    },[]);
    console.log(`${auth.status} is from Auth require`);
    console.log(`${userLog}`)
    return(
       auth.status==200 || userLog==200 ?<Outlet/>:<><Navigate to="/login" /></>
    )
}