import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Select,
    Space,
    InputNumber,
    Checkbox,
    Radio,
    RadioChangeEvent
} from 'antd';
import { Container } from 'react-bootstrap';
import { diseaseType } from '../../diseaseManage/diseaseType.tsx'




const { TextArea } = Input;
const { Option } = Select;


const QuestionInsert: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };


    const [type, setType] = useState<'单选' | '多选' | '判断'>('单选');
    const [single, setSingle] = useState(false);
    const [multiple, setMultiple] = useState(true);
    const [judge, setJudge] = useState(true);



    const typeChange = (e: RadioChangeEvent) => {
        console.log(e.target.value)
        const type = e.target.value;
        setType(type);
        if (type === "多选") {
            setMultiple(false); //显示多选题答案
            setSingle(true);
            setJudge(true);
        }
        else if (type === "判断") {
            setJudge(false);
            setSingle(true);
            setMultiple(true);
        } else {
            setSingle(false);
            setMultiple(true);
            setJudge(true);
        }

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

                    <Form.Item label="选择题型" name="type">
                        <Radio.Group value={type} defaultValue="单选" buttonStyle="solid" onChange={typeChange}>
                            <Radio.Button value="单选">单选</Radio.Button>
                            <Radio.Button value="多选">多选</Radio.Button>
                            <Radio.Button value="判断">判断</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="选择疾病类别"
                        rules={[{ required: true, message: 'Disease  type is required' }]}>
                        <Select placeholder="Select a disease type">
                            {/* import diseaseType from .... 数组渲染 */}
                            {
                                diseaseType.map(disease => (
                                    <Option value={disease.value}>{disease.text}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label="题目描述" name="description">
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="题目选项" >
                        <Form.List name="choices">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'first']}
                                                rules={[{ required: true, message: '请填写选项内容' }]}
                                            >
                                                <Input placeholder="选项" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button disabled={!judge} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            添加选项
                                            {/* TODO: 限制加4个选项 */}
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                    <Form.Item label="单选题答案">
                        <Radio.Group disabled={single}>
                            <Radio value={0}>A</Radio>
                            <Radio value={1}>B</Radio>
                            <Radio value={2}>C</Radio>
                            <Radio value={3}>D</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="多选题答案" >
                        <Checkbox.Group disabled={multiple}>
                            <Checkbox value="0">A</Checkbox>
                            <Checkbox value="1">B</Checkbox>
                            <Checkbox value="2">C</Checkbox>
                            <Checkbox value="3">D</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item label="判断题答案">
                        <Radio.Group disabled={judge}>
                            <Radio value="true"> 对 </Radio>
                            <Radio value="false"> 错 </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="分数">
                        <InputNumber />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Container>


    );

}


export default QuestionInsert;

