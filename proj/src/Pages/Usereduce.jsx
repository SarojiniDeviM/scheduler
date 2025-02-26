import React from 'react'
import{ useReducer } from 'react'
const reducer =  (state,action)=>{
    switch(action.type)
    {
        case "increment":
            return{count:state.count+1}
        case "decrement":
            return{count:state.count-1}
        case "reset":
            return{count:0}
        default:
            return state
    }
}
const Usereduce = () => {
    const[state,dispatch]=useReducer(reducer,{count:0})
  return (
    <div>
         <h1>Count:{state.count}</h1>
         <button onClick={()=>dispatch({type:"increment"})}>+</button>
         <button onClick={()=>dispatch({type:"decrement"})}>-</button>
         <button onClick={()=>dispatch({type:"reset"})}>reset</button>
    </div>
  )
}

export default Usereduce