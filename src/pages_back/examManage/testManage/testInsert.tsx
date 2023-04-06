import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Select,
    Upload,
    Space,
    Modal,
    InputNumber,
    Checkbox,
    Radio,
    RadioChangeEvent,
    DatePicker,
    SelectProps
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Container } from 'react-bootstrap';
import { diseaseType } from '../../diseaseManage/diseaseType.tsx'



// TODO: 新增每场考试，可以选择相应的考试试卷(select?)，开始时间(DatePicker)和结束时间，以及哪些学生(multi-select)可以参加考试。

dayjs.extend(customParseFormat);
//时间范围选择器
const { RangePicker } = DatePicker;

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
    options.push({
        label: i.toString(36) + i,
        value: i.toString(36) + i,
    });
}


const TestInsert: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };

    return (
        <Container style={{ width: '100%', height: '100%' }}>
            <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    style={{ maxWidth: '100%', marginLeft: 100 }}
                >

                    <Form.Item label="选择试卷" name="paperId">
                        {/* Select */}
                        <Select
                            size="large"
                            showSearch //带搜索的选择框
                            style={{ width: 160 }}
                            placeholder="Select a paper"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: '试卷1',
                                    label: '试卷1',
                                },
                                {
                                    value: '试卷2',
                                    label: '试卷2',
                                },
                                {
                                    value: '试卷3',
                                    label: '试卷3',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="考试时间" name="beginDate">
                        <RangePicker
                            // disabledDate={disabledDate}
                            // disabledTime={disabledRangeTime}
                            size='large'
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </Form.Item>

                    <Form.Item label="参考学生">
                        {/* multi-select */}
                        <Select
                            size="large"
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="选择参加考试的学生" //返回全部学生
                            defaultValue={['a10', 'c12']}
                            // onChange={handleChange}
                            options={options}
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Container>
    );

}

export default TestInsert;

