import React from 'react'
import {useState} from "react"
const Usestate = () => {
    const [formData,setFormData]=useState({
        name:"",email:"",address:""
    })
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log("Form Data",formData);
    }
  return (
    <div>
    <form onSubmit={handleSubmit}>
    <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange}/>
        <br></br>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange}/>
        <br></br>
        <label>Address</label>  
        <input type="text" name="address" value={formData.address} onChange={handleChange}/>
        <br></br>
        <button type='submit'>submit</button>
    </form>
    </div>

  )
}

export default Usestate