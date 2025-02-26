import { createContext,useContext,useState } from "react";

const UserContet = createContext() 
export function UserProvider({children})
{
    const [user,setUser]=useState('user1')
  return (
    <UserContet.Provider value={{user,setUser}}>
        {children}
    </UserContet.Provider>
  )
}

export function useUser()
{
    return useContext(UserContet)
}
