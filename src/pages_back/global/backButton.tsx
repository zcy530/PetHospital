import React from 'react'
import { useNavigate } from 'react-router-dom';
import { LeftOutlined} from '@ant-design/icons';
const BackButton = () => {
    const navigate = useNavigate();
    return (
        <div>
            <LeftOutlined style={{ width: '30px', fontSize: '20px' }} onClick={() => navigate(-1)} />
            <span style={{ fontSize: '16px' }}>返回</span>
        </div>
    )
}

export default BackButton;