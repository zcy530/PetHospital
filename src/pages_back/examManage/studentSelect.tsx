import React, { useEffect, useState } from 'react';
import { Select, } from 'antd';
import Loading from '../global/loading.tsx'

const { Option } = Select;

interface studentOption {
    userId: number,
    email: string,
}

interface option {
    value: number,
    label: string
}


const StudentSelect: React.FC = (props) => {
    // console.log("student props:");
    console.log(props);

    const [studentList, setStudent] = useState<studentOption[]>([]);
    const [defaultUsers, setDefaultUsers] = useState<option[]>([]);

    useEffect(() => {
        //如果有传进来userList 就setDefaultValue
        if (props.userList) {
            const userList = props.userList;
            console.log(userList)
            setDefaultUsers(userList)
        }
        fetch('http://localhost:8080/petHospital/users')
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // console.log(data.result);
                const lists = data.result;
                let student_List: studentOption[] = [];
                lists.map(list => {
                    if (list.role === 'student')
                        student_List.push({ "userId": list.userId, "email": list.email })
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
            defaultValue={props.userList ? props.userList : null}
            onChange={handleChange}>
            {
                studentList ? (
                    studentList.map(student =>
                        <Option key={student.userId}> {student.email} </Option>
                    )
                ) : (
                    <>
                        <Loading />
                    </>
                )
            }

        </Select>
    )


}

export default StudentSelect;