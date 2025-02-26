import React from 'react'
import {useUser} from "./UserContet"
const Child = () => {
    const {user,setUser}=useUser()
  return (
    <div>
        Hi! {user}
        <button onClick={()=>setUser('User2')}>Change</button>
        
        </div>
  )
}

export default Child