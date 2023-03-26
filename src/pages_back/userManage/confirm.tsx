import React from "react";
import { Button, Input, Space, Table, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Success, Fail } from './alert.tsx'


const { confirm } = Modal;

export const ShowDeleteConfirm = (id: number) => {
    confirm({
        title: '确认删除该用户吗？',
        icon: <ExclamationCircleFilled />,
        // content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
            console.log('OK');
            //删除的事件 DELETE
            fetch(`https://localhost:8080/petHospital/users/${id}`, {
                method: 'DELETE',
            }).then((response) => {
                if (response.status === 200) {
                    // setPosts(
                    //   posts.filter((post) => {
                    //     return post.id !== id;
                    //   })
                    // );
                    console.log('删除成功！')
                    //返回删除成功的提示
                    return <Success />
                } else {
                    console.log('删除失败！')
                    return <Fail />;
                }
            });
        },
        onCancel() {
            console.log('Cancel');
        },
    });
};