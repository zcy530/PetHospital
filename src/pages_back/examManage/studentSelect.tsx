import React, { useEffect, useState } from 'react';
import { Select, } from 'antd';
import Loading from '../global/loading.tsx'
import { useSelector } from 'react-redux';

const { Option } = Select;

interface studentOption {
    userId: number,
    email: string,
}


const StudentSelect = (props) => {
    // console.log("student props:");
    console.log(props);
    const userLogin = useSelector(state => state.userLogin)
    const token = userLogin.userInfo.data.result.token;
    const [studentList, setStudent] = useState<studentOption[]>([]);

    useEffect(() => {
        fetch('https://47.120.14.174:443/petHospital/users',
        { headers: { 'Authorization': token } }
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // console.log(data.result);
                const lists = data.result;
                let student_List: studentOption[] = [];
                lists.map(list => {
                    // if (list.role === 'user')
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
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="选择参加考试的学生"
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