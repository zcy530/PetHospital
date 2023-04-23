import React, { useState, useEffect } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    List,
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
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionDetailType } from './questionType.tsx'
import BackButton from '../../global/backButton.tsx';

const { TextArea } = Input;
const { Option } = Select;

interface ChoiceOption {
    choice: string
}
const options: string[] = ['A', 'B', 'C', 'D'];


//编辑问题
const QuestionUpdate = () => {
    const param = useParams();

    const [form] = Form.useForm();
    const [detail, setDetail] = useState<QuestionDetailType>({});
    const navigate = useNavigate(); //跳转路由

    useEffect(() => {
        fetch("https://47.120.14.174:443/petHospital/questions/" + param.questionId, { method: 'GET' })
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                const res = data.result;
                const type = res.questionType;
                //设置detail值为data
                setDetail(data.result);
                //获取原始选项
                const choices = getChoice(res.choice)
                console.log(choices)
                form.setFieldValue("choices", choices);
                //form setValue 
                if (type === '单选') {
                    setType('单选')
                    setSingle(false);
                    setMultiple(true);
                    setJudge(true);
                    getSingleAns(res.choice, res.ans)
                } else if (type === '多选') {
                    setType('多选')
                    setSingle(true);
                    setMultiple(false);
                    setJudge(true)
                    getMultiAns(res.choice, res.ans)
                } else {
                    setType('判断')
                    setSingle(true);
                    setMultiple(true);
                    setJudge(false)
                    getJudgeAns(res.choice, res.ans)
                }
                //set form value
                form.setFieldValue("questionType", type)
                form.setFieldValue("description", res.description)
                form.setFieldValue("keyword", res.keyword)
                form.setFieldValue("diseaseId", res.disease.diseaseId)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    //获取原始表单的选项 并且set
    const getChoice = (resChoice: string[]) => {
        let choices: ChoiceOption[] = []
        resChoice.map(c => {
            choices.push({ "choice": c })
        })
        return choices;
    }

    //根据原始答案set表单中的选项
    const getSingleAns = (choices: string[], ans: string[]) => {
        //获取ans在choices里面的下标
        const res = getIndex(choices, ans);
        console.log(res);
        const index = res[0];
        form.setFieldValue("single_ans", index.toString());
    }

    const getMultiAns = (choices: string[], ans: string[]) => {
        const res = getIndex(choices, ans);
        console.log(res);
        let index: string[] = [];
        res.map(r => {
            index.push(r.toString())
        })
        form.setFieldValue("multi_ans", index);
    }

    const getJudgeAns = (choices: string[], ans: string[]) => {
        const res = getIndex(choices, ans);
        console.log(res);
        const index = res[0];
        console.log("index为" + index.toString())
        form.setFieldValue("judge_ans", index.toString())
    }

    //获取ans在choices里面的下标
    const getIndex = (choices: string[], ans: string[]) => {
        let res: number[] = [];
        ans.map(a => {
            res.push(choices.indexOf(a));
        })
        return res;
    }

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

            fetch('https://47.120.14.174:443/petHospital/questions/' + param.questionId, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    "ans": ans,
                    "choice": choice,
                    "description": description,
                    "diseaseId": diseaseId,
                    "keyword": keyword,
                    "questionId": param.questionId,
                    "questionType": questionType
                })
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let res = data.result.modifiedRecordCount;
                    if (res === 1) {
                        message.success("修改成功！")
                        // 跳转至 paper-detail
                        navigate(`/systemManage/exercise/detail/${param.questionId}`, { replace: true })
                    }
                    else message.error("添加失败，请稍后再试！");
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
        )
    }

    const multiSelectChange = (rule, value, callback) => {
        if (value.length < 2) {
            // message.error('请至少选择2个');
            // form.setFieldsValue({
            //     "multi_ans": _.take(value, 2),
            // })
            callback('请至少选择2个正确答案')
        } else {
            callback()
        }
    };

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
                        rules={[{ required: true, message: '请选择题目类型！' }]}>
                        <Radio.Group name="questionType" value={type} buttonStyle="solid" onChange={typeChange}>
                            <Radio.Button value="单选">单选</Radio.Button>
                            <Radio.Button value="多选">多选</Radio.Button>
                            <Radio.Button value="判断">判断</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="选择疾病类别" name="diseaseId"
                        rules={[{ required: true, message: '请选择疾病类别！' }]}>
                        <Select placeholder="Select a disease type" >
                            {
                                diseaseType.map(disease => (
                                    <Option value={disease.id}>{disease.text}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="题目描述" name="description"
                        rules={[{ required: true, message: '请填写题目描述！' }]}>
                        <TextArea rows={3} placeholder={detail.description} />
                    </Form.Item>

                    <Form.Item label="关键词" name="keyword"
                    >
                        <Input />
                    </Form.Item>

                    {/* 如果是判断 这里要隐藏 */}
                    {judge === false ? (<>

                    </>) : (<>
                        <Form.Item label="题目选项" >
                            <Form.List name="choices" >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                {options[key]}
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'choice']}
                                                    rules={[{ required: true, message: '请填写选项内容' }]}
                                                >
                                                    <Input placeholder="选项" />
                                                </Form.Item>
                                                {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                                            </Space>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </>)}


                    <Form.Item label="单选题答案" name="single_ans"
                        rules={[{ required: !single, message: '请选择题目答案！' }]}>

                        <Radio.Group disabled={single}>
                            <Radio value="0">A</Radio>
                            <Radio value="1">B</Radio>
                            <Radio value="2">C</Radio>
                            <Radio value="3">D</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="多选题答案" name="multi_ans"
                        rules={[{ required: !multiple, validator: multiSelectChange }]}>
                        <Checkbox.Group disabled={multiple}>
                            {/* 多选至少选2个 */}
                            <Checkbox value="0">A</Checkbox>
                            <Checkbox value="1">B</Checkbox>
                            <Checkbox value="2">C</Checkbox>
                            <Checkbox value="3">D</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item label="判断题答案" name="judge_ans"
                        rules={[{ required: !judge, message: '请选择题目答案！' }]}>
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

export default QuestionUpdate;