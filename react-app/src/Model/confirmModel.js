import React, { useState } from "react";
import {X} from 'lucide-react';
import e from "cors";
import '../css/home.css'
export default function ConfirmModel({confirmStates,onConfirm,onClose}){
    const {isConfirm,setIsConfirm}=confirmStates;
    const [date,setDate]=useState(null);
    const conditionCheck=async(e)=>{
        e.preventDefault();
        console.log(`${isConfirm} is the book details`);
        if(isConfirm=="true"){
            
            await onConfirm(date);
            onClose();
            return;
        }else{
            onClose();
            return;
        }
    }
    
    return(
        <div className="confirm_panel   fixed inset-0 bg-opacity-30 backdrop-blur-sm flex flex-col justify-center items-center">
        <button onClick={onClose} className="bg-red-500 rounded-2xl px-1 py-1 active:bg-black active:text-white">
            <X/>
        </button>
       <div>
       
      <form onSubmit={conditionCheck} className=" w-auto h-auto bg-purple-950 flex flex-col gap-4 justify-center items-center border  rounded-lg  border-gray-400">
      <p className="text-purple-50 font-sans font-bold px-2">Are you sure you want to book this room </p>
    
    <div>
        <div>
            <p className="text-purple-50 font-sans font-bold">Schedule your booking date :</p>
            <input type="date" onChange={(e)=>setDate(e.target.value)}/>
        </div>
    <label for='yes' className=" flex gap-1">
   <span className="text-xl font-bold text-white">Yes:</span>
   <input id="yes"type="radio" name='confirm-book' value={true} onChange={(e)=>setIsConfirm(e.target.value)}/>
   </label>

       <label for="no" className=" flex gap-1">
        <span className="text-xl font-bold text-white"> No:</span>
       <input id="no"type="radio" name="confirm-book" value={false} onChange={(e)=>setIsConfirm(e.target.value)}/>
       </label>
    </div>
       <div > <button type="submit" className="bg-blue-800 px-2 py-2 rounded-xl text-yellow-50 active:bg-black active:text-purple-100 ">Submit</button></div>
      </form>
       </div>
        </div>
    )
}