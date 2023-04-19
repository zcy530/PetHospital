import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Select,
    Space,
    Checkbox,
    Radio,
    RadioChangeEvent,
    message
} from 'antd';
import { Container } from 'react-bootstrap';
import { diseaseType } from '../../diseaseManage/diseaseType.tsx'
import { useNavigate } from 'react-router-dom';
import BackButton from '../../global/backButton.tsx';

const { TextArea } = Input;
const { Option } = Select;

const QuestionInsert: React.FC = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate(); //跳转路由

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

    const submitQuestion = () => {
        let questionType = type;
        let keyword = "";
        let diseaseId = 0;
        let description = "";
        let choice = new Array(4);
        let ans: string[] = [];
        //获取表单的值
        form.validateFields().then((values) => {
            console.log('Received values of form: ', values);
            description = values.description;
            keyword = values.keyword;
            diseaseId = values.diseaseId;

            if (type === "单选") {
                console.log(values.choices)
                let array = new Array(4);
                values.choices.map((choice, index) => {
                    console.log(choice.choice)
                    array[index] = choice.choice
                })
                console.log(array);
                choice = array;
                ans = [choice[values.single_ans]]; //对应选项的值
            } else if (type === "多选") {
                let array = new Array(4);
                values.choices.map((choice, index) => {
                    console.log(choice.choice)
                    array[index] = choice.choice
                })
                console.log(array);
                choice = array;
                values.multi_ans.map((ans_index, index) => (
                    ans[index] = choice[ans_index]
                ));
            } else {
                choice = ["对", "错"];
                ans = [choice[values.judge_ans]]
            }
            console.log(choice)
            console.log(ans)

            fetch('https://47.120.14.174:443/petHospital/questions', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    "ans": ans,
                    "choice": choice,
                    "description": description,
                    "diseaseId": diseaseId,
                    "keyword": keyword,
                    "questionId": 0,
                    "questionType": questionType
                })
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let res = data.success;
                    if (res === true) {
                        message.success("添加成功！")
                        //TODO： 跳转至 detail
                        // 跳转至 paper-detail
                        navigate(`/systemManage/exercise/detail/${data.result.questionId}`, { replace: true })
                    }
                    else message.error("添加失败，请稍后再试！");
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
        )
    }

    return (
        <Container style={{ width: '100%', height: '100%' }}>

            <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
                <BackButton />
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    style={{ maxWidth: '100%', marginLeft: 100 }}
                >

                    <Form.Item label="选择题型" name="questionType"
                        rules={[{ required: true, message: 'Question type is required' }]}>
                        <Radio.Group name="questionType" value={type} buttonStyle="solid" onChange={typeChange}>
                            <Radio.Button value="单选">单选</Radio.Button>
                            <Radio.Button value="多选">多选</Radio.Button>
                            <Radio.Button value="判断">判断</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="选择疾病类别" name="diseaseId"
                        rules={[{ required: true, message: 'Disease  type is required' }]}>
                        <Select placeholder="Select a disease type">
                            {
                                diseaseType.map(disease => (
                                    <Option value={disease.id}>{disease.text}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="题目描述" name="description"
                        rules={[{ required: true, message: 'Required' }]}>
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="关键词" name="keyword"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="题目选项">
                        <Form.List name="choices">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'choice']}
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

                    <Form.Item label="单选题答案" name="single_ans">
                        <Radio.Group disabled={single}>
                            <Radio value="0">A</Radio>
                            <Radio value="1">B</Radio>
                            <Radio value="2">C</Radio>
                            <Radio value="3">D</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="多选题答案" name="multi_ans">
                        <Checkbox.Group disabled={multiple}>
                            <Checkbox value="0">A</Checkbox>
                            <Checkbox value="1">B</Checkbox>
                            <Checkbox value="2">C</Checkbox>
                            <Checkbox value="3">D</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item label="判断题答案" name="judge_ans">
                        <Radio.Group disabled={judge}>
                            <Radio value="0"> 对 </Radio>
                            <Radio value="1"> 错 </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" onClick={submitQuestion}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Container>

    );

}


export default QuestionInsert;

