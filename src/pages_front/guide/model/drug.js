import React, { useEffect, useState} from 'react'

function Drug({name,type,intro,price}) {
  // const [Obj, setobj] = useState({});
  return (
    <div className='drug'>
        <div>{name}</div>
        <div>适用疾病：{type}</div>
        <div>介绍：{intro}</div>
        <div>价格：{price}元</div>
    </div>
  )
}

export default Drug
