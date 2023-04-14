import React, { useEffect, useState} from 'react'

function Drug({name,type,intro,price}) {
  // const [Obj, setobj] = useState({});
  useEffect(() => {
    console.log(name)
  },[])
  return (
    <div>
      <div className='drug'>
          <div>{name}</div>
          <div>适用疾病：{type}</div>
          <div>介绍：{intro}</div>
          <div>价格：{price}</div>
        </div>
    </div>
  )
}

export default Drug
