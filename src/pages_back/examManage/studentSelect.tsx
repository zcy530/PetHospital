import React, { useEffect, useState } from 'react';
import {
    Alert,
    Select,
    Spin
} from 'antd';

const { Option } = Select;

interface studentOption {
    id: number,
    email: string,
    class: string
}


const StudentSelect: React.FC = (props) => {

    const [studentList, setStudent] = useState<studentOption[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/petHospital/users'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                const lists = data.result;
                let student_List : studentOption[] = [];
                lists.map(list => {
                    if(list.role === 'student')
                        student_List.push({ "id": list.userId, "email": list.email, "class": list.userClass })
                })
                //赋值给paper
                setStudent(student_List);
            })
            .catch((err) => {
                console.log(err.message);
            });
    
    }, []);

    
    const handleChange = (e) => {
        console.log(e);
        props.getStudent(e);
    }

    return (
        <Select
            size="large"
            showSearch //带搜索的选择框
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="选择参加考试的学生" 
            onChange={handleChange}
        >
            {
                studentList ? (
                    studentList.map(student =>
                        <Option key={student.id}> {student.email} </Option>
                    )
                ) : (
                    <>
                        <Spin tip="加载中...">
                            <Alert
                                message="疯狂加载中"
                                description="不要走开喵"
                                type="info"
                            />
                        </Spin>
                    </>
                )
            }

        </Select>
    )


}

export default StudentSelect;