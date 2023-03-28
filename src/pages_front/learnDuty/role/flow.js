import React from 'react'
import './flow.css'
import SingleFlow from './singleFlow.js'


function flow() {
  var flowName = "消毒流程", flowsArr = ["剃毛","洗净","二次法","覆盖"]
  return (
    <div className='flow'>
      <SingleFlow flowName={flowName} flowsArr={flowsArr}/>
      <SingleFlow flowName={flowName} flowsArr={flowsArr}/>
      <SingleFlow flowName={flowName} flowsArr={flowsArr}/>
    </div>
  )
}

export default flow
