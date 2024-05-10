import React ,{useContext} from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
export default function AuthHook(){
    return(
        useContext(AuthContext)
    );
}