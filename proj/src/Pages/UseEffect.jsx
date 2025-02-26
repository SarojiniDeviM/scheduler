import React from 'react'
import {useEffect,useState} from "react"
const UseEffect = () => {
    const [count,setCount]=useState(0)

    useEffect(()=>
    {
        console.log("Component mounted");
        return ()=>{
            console.log("Component unmounted");
        }
    },[count])

    return (
        <div>
            <button onClick={()=>setCount(count+1)}>Increment</button>
        </div>
    )
}
export default UseEffect;