import React from 'react';
import './newDutyLearn.css';
import RoleButton from './roleButton.js';
import DeskIcon from '@mui/icons-material/Desk';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import MedicationIcon from '@mui/icons-material/Medication';

function newDutyLearn() {
  return (
    
    <div className='newDutyLearn'>
        <div className='dutyLearn-title'>
            <h1>请选择你要扮演的角色</h1>
        </div>
        <RoleButton roleName="前台" Avatar={DeskIcon}/>
        <RoleButton roleName="医助" Avatar={MedicationLiquidIcon}/>
        <RoleButton roleName="兽医师" Avatar={MedicationIcon}/>
        <div className='border-left'></div>
        <div className='border-right'></div>
        <div className='bottom-left'></div>
        <div className='bottom-right'></div>
        <div className='bottom'></div>
    </div>
  )
}

export default newDutyLearn
