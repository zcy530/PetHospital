import React, { useEffect, useRef, useState } from 'react';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { DeleteTwoTone, EditTwoTone, SearchOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Input, InputRef, Space, Table, Modal, message } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { UserType } from './userType';
import UserCreateForm from './addUserForm.tsx';
import UserEditForm from './editUserForm.tsx'


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

  //定义两个变量 一个对应创建的窗口 一个对应编辑的窗口
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  //editRecord用于记录点击的record的信息，传给编辑窗口
  const [editRecord, setEditRecord] = useState<UserType>({ key: [], userId: 0, role: '', email: '', userClass: '' });

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    setCreateFormOpen(false);
    setEditFormOpen(false);
  };

  //全局消息提示
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    // messageApi.open({
    //   type: 'success',
    //   content: '操作成功！',
    //   duration: 1.5,
    // });
    messageApi
      .open({
        type: 'loading',
        content: 'Action in progress..',
        duration: 1,
      })
      .then(() => message.success('操作成功！', 1.5))
  };

  const fail = () => {
    messageApi
      .open({
        type: 'loading',
        content: 'Action in progress..',
        duration: 1,
      })
      .then(() => message.error('操作失败，请重试！', 1.5))
  }


  //新增操作
  const addUsers = () => {
    setCreateFormOpen(true); //设置open为true，用于弹出弹出填写用户信息的表单
    // console.log("点击新增：" + createFormOpen)
  }

  //编辑操作
  const edit = (record: UserType) => {
    console.log("点击编辑id为" + record.userId);
    //跳出编辑的对话框
    setEditFormOpen(true); //设置open为true，用于弹出弹出修改用户信息的表单
  };

  //删除操作
  const del = (id: number) => {
    console.log("点击删除id为" + id + "的用户");
    //弹出对话框 是否删除？
    showDeleteConfirm(id);
  }

  //批量删除
  const batchDel = () => {

  }

  const { confirm } = Modal;

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: '确认删除该用户吗？',
      icon: <ExclamationCircleFilled />,
      // content: '用户id为:' + id,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        console.log('OK');
        //删除的事件 DELETE
        await fetch(`http://localhost:8080/petHospital/users/${id}`, {
          method: 'DELETE',
        }).then((response) => {
          if (response.status === 200) {
            //TODO：重新加载页面（好像并不合适）
            console.log('删除成功！')
            //返回删除成功的提示
            success()
          } else {
            console.log('删除失败！')
            fail()
          }
        }).catch(e => {
          console.log('错误:', e)
          fail()
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
      // key: 'userId',
      // 该列添加搜索功能
      ...getColumnSearchProps('userId'),
      // render: (text) => <a>{text}</a>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      // key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: '班级',
      dataIndex: 'userClass',
    },
    {
      title: '角色',
      dataIndex: 'role',
    },
    {
      title: '操作',
      // key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditTwoTone onClick={() => {
            console.log(record)
            //这一行的数据赋值给editRecord
            setEditRecord(record)
            console.log(editRecord.email)
            edit(record)
          }
          } />
          <DeleteTwoTone onClick={() => {
            del(record.userId)
            //添加filter方法
          }
          } />
        </Space>
      ),
    },
  ];


  //用于多选的变量和函数
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  //重置选择状态
  const reload = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  //监听选择框编号
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  //定义每行前面的选择框
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //被选的行数
  const hasSelected = selectedRowKeys.length > 0;

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //获取后台数据
    fetch('http://localhost:8080/petHospital/users'
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

  //后台获取的posts赋值给userData。加上key
  const userData: UserType[] = [];
  for (let i = 0; i < posts.length; i++) {
    userData.push({
      key: i,
      userId: posts[i].userId,
      email: posts[i].email,
      role: posts[i].role,
      userClass: posts[i].userClass
    });
  }

  return (
    <div>
      <Space size={500}>
        <Space>
          <Button type="primary" onClick={reload} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `选择了 ${selectedRowKeys.length} 个用户` : ''}
          </span>
        </Space>
        <Space wrap>
          {contextHolder}
          <Button type="primary" ghost onClick={addUsers}>新增用户</Button>
          {/* TODO:批量删除用户  */}
          <Button type="primary" danger ghost onClick={batchDel}>删除用户</Button>
        </Space>
      </Space>

      {/* 创建用户的表单 open为true时弹出 */}
      <UserCreateForm
        open={createFormOpen}
        onCreate={onCreate}
        onCancel={() => {
          setCreateFormOpen(false);
        }} />

      {/* 编辑用户的表单 open为true时弹出 */}
      <UserEditForm
        open={editFormOpen}
        record={editRecord}
        onCreate={onCreate}
        onCancel={() => {
          setEditFormOpen(false);
        }} />

      <Table rowSelection={rowSelection} columns={columns} dataSource={userData} style={{ margin: 16 }} />
    </div >
  );
};

export default UserInfo;