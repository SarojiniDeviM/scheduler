import {useRef,useState} from "react"
const Useref = ()=>{
    const [count,setCount]= useState(0)
    const refCount=useRef(0)

    const increment =()=>
    {
        setCount(count+1)
        refCount.current++;

        console.log('State: ',count);
        console.log('Ref',refCount.current);
    }
    return (
        <div>
            <h1>Count1:{refCount.current}</h1>
            <button onClick={increment}>Increment</button>
        </div>
    )
}
export default Useref