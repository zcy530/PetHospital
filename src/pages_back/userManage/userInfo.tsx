import React, { useEffect, useRef, useState } from 'react';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { DeleteTwoTone, EditTwoTone, SearchOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Input, InputRef, Space, Table, Modal } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { UserType } from './userType';
import {Success, Fail} from './alert.tsx';
import {ShowDeleteConfirm} from './confirm.tsx';

type DataIndex = keyof UserType;

const UserInfo: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  // 搜索输入框
  const searchInput = useRef<InputRef>(null);

  //处理搜索的函数
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  //重置
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  //获取列
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<UserType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    //渲染搜索框页面
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  //编辑操作
  const edit = (id: number) => {
    console.log("点击编辑id为" + id + "的用户");
    //跳出编辑的对话框
  };

  //删除操作
  const del = (id: number) => {
    console.log("点击删除id为" + id + "的用户");
    //弹出对话框 是否删除？
    showDeleteConfirm(id);
  }

  const { confirm } = Modal;

  const showDeleteConfirm = (id: number) => {
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


  // 定义列
  const columns: ColumnsType<UserType> = [
    {
      title: '用户id',
      dataIndex: 'userId',
      key: 'userId',
      // width: '30%',
      // 该列添加搜索功能
      ...getColumnSearchProps('userId'),
      // render: (text) => <a>{text}</a>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: '班级',
      dataIndex: 'userClass',
      key: 'userClass',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },

    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditTwoTone onClick={() => edit(record.userId)} />
          <DeleteTwoTone onClick={() => del(record.userId)} />
        </Space>
      ),
    },
  ];

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    //获取后台数据
    fetch('http://localhost:8080/petHospital/users',
    )
      .then(
        (response) => response.json(),
      )
      .then((data) => {
        console.log(data.result);
        setPosts(data.result);
        //设置posts值为data
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  console.log(posts);

  return <Table rowKey={(r) => r.userId} columns={columns} dataSource={posts} />;
};

export default UserInfo;