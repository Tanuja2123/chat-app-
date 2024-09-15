import React, { useState } from 'react'
import "./Join.css";
import logo from "../../images/logo.png";
import {Link} from "react-router-dom";

let user;
const Join = () => {

    const sendUser = () => {
        user = document.getElementById('joinInput').value;
        document.getElementById('joinInput').value="";
    }
    const [name, setname] = useState("");
    // console.log(name);
  return (
    <div className='JoinPage'>
        <div className='JoinContainer'>
            <img src={logo} alt="logo"/>
            <h1>Chat-App</h1>
            <input onChange={(e)=>setname(e.target.value)} placeholder='Enter Your Name' type="text" id="joinInput" />
            <Link onClick={(e)=> !name? e.preventDefault(): null} to="/chat" ><button onClick={sendUser} className="joinBtn">LogIn</button></Link>
        </div>
    </div>
  )
}

export default Join
export {user}