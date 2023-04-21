import { Descriptions, Layout, Image } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../../global/backButton.tsx";

const MedicineDetail = () => {
    const { state } = useLocation();
    //console.log(state)
    const record = state.record;

    return (
        <Layout className='system-manage-content'>
            <div style={{ textAlign: 'left' }}><BackButton /></div>
            <Descriptions column={3}
                bordered size='middle'
                labelStyle={{ justifyContent: 'flex-end' }}
                contentStyle={{ justifyContent: 'flex-end' }}
                style={{ marginTop: '30px' }}>
                <Descriptions.Item label="药品名称" >{record?.name}</Descriptions.Item>
                <Descriptions.Item label="药品类别" >{record?.type}</Descriptions.Item>
                <Descriptions.Item label="药品价格" >{record?.price}￥</Descriptions.Item>
                <Descriptions.Item label="药品简介" span={3}>{record?.intro}</Descriptions.Item>
                <Descriptions.Item label="药品图片">
                    <Image width={300}
                        src={record?.url}
                    />
                </Descriptions.Item>
            </Descriptions>
        </Layout>
    )

}
export default MedicineDetail;