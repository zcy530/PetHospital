import React from 'react'

function vaccine({name, intro}) {
  return (
    <div className='vaccine'>
      <div>疫苗名称：{name}</div>
      <div>疫苗介绍：{intro}</div>
    </div>
  )
}

export default vaccine
