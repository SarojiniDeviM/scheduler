let n=99
let ans = (n%2===0) ? "Even":"Odd"


const numbers=[2,3,4,5,6,7,8]
const ans1=numbers.map(num=>num*3)
console.log(ans1)

const  obj=[
       { name:"name1",mark:90},
       { name:"name2",mark:60},
       { name:"name3",mark:30},
       { name:"name4",mark:65},
       { name:"name5",mark:99},
]
const print=obj.map(object=>object.name)
const abv75=obj.filter(n=>n.mark>75)
console.log(abv75);
console.log(print);
const arr=[2,3,1,4,3,8,9,7]
const even=arr.filter(num=>num%2==0)
console.log(even);
const array=[21,11,33,44,5,55,66]
const total=array.reduce((sum,n)=>sum+n,0)
console.log(total);
const totalM=obj.reduce((sum,n)=>sum+n.mark,0)
console.log(totalM);