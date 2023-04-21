import React, { useEffect, useRef, useState } from 'react';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import {
  DeleteTwoTone,
  EditTwoTone,
  SearchOutlined,
  MailOutlined,
  ExclamationCircleFilled,
  LockOutlined,

} from '@ant-design/icons';
import { Button, Input, Select, Form, InputRef, Space, Table, Tag, Modal, message } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { UserType } from './userType';
import Loading from '../global/loading.tsx'


type DataIndex = keyof UserType;
const { Option } = Select;

//------------------------------------------
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: UserType) => void;
  onCancel: () => void;
}

interface CollectionEditFormProps {
  open: boolean;
  record: UserType;
  onCreate: (values: UserType) => void;
  onCancel: () => void;
}
//----------------------------------------------

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

  // 记录用户数据
  const [userData, setUserData] = useState<UserType[]>([]);
  const [count, setCount] = useState(0);
  //用于多选的变量和函数
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //选择的用户 的 id
  const [userList, setUserList] = useState<number[]>([]);

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
    let users: number[] = [];
    newSelectedRowKeys.map((key) => {
      console.log("对应的问题的id：" + userData[key].userId)
      let id = userData[key].userId;
      users.push(id); //加入问题id的列表
    })
    console.log('selectedQuestion changed: ', users);
    setUserList(users)
  };

  //定义每行前面的选择框
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //被选的行数
  const hasSelected = selectedRowKeys.length > 0;
  useEffect(() => {
    //获取后台数据
    fetch('https://47.120.14.174:443/petHospital/users'
    )
      .then(
        (response) => response.json(),
      )
      .then((data) => {
        console.log(data.result);
        let records = data.result;
        let userDataTmp: UserType[] = [];
        for (let i = 0; i < records.length; i++) {
          userDataTmp.push({
            key: i,
            userId: records[i].userId,
            email: records[i].email,
            role: records[i].role,
            userClass: records[i].userClass
          });
        }
        setUserData(userDataTmp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [count]);

  //定义两个变量 一个对应创建的窗口 一个对应编辑的窗口
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  //editRecord用于记录点击的record的信息，传给编辑窗口
  const [editRecord, setEditRecord] = useState<UserType>({ key: 0, userId: 0, role: '', email: '', userClass: '' });

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    setCreateFormOpen(false);
    setEditFormOpen(false);
  };

  //新增操作
  const addUsers = () => {
    setCreateFormOpen(true); //设置open为true，用于弹出弹出填写用户信息的表单
  }

  //创建用户的表单
  const UserCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
  }) => {
    const [form] = Form.useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
      //用Modal弹出表单
      <Modal
        open={open} //是
        title="创建新用户"
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
              fetch('https://47.120.14.174:443/petHospital/users', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                  "email": values.email,
                  "password": values.password,
                  "role": values.role,
                  "userClass": values.userClass
                })
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                  let res = data.success;
                  if (res === true) {
                    message.success("添加成功！");
                    setCount(count + 1);
                  }
                  else {
                    message.error("添加失败，请稍后再试！");
                  }
                })
                .catch((err) => {
                  console.log(err.message);
                });
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        {/* {contextHolder} */}
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          {/* 填写邮箱 */}
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: 'Please input email!' }]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          {/* 填写密码 */}
          <Form.Item name="password" label="密码"
            rules={[{ required: true, message: 'Please input password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
            />
          </Form.Item>
          {/* 选择角色 */}
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select placeholder="Select role">
              <Option value="student">student</Option>
              <Option value="manager">manager</Option>
            </Select>
          </Form.Item>
          {/* 选择班级 */}
          <Form.Item
            name="userClass"
            label="班级"
            rules={[{ required: true, message: 'Please input class!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  };

  //编辑操作
  const edit = (record: UserType) => {
    console.log("点击编辑id为" + record.userId);
    //跳出编辑的对话框
    setEditFormOpen(true); //设置open为true，用于弹出弹出修改用户信息的表单
  };

  const UserEditForm: React.FC<CollectionEditFormProps> = ({
    open,
    record,
    onCreate,
    onCancel,
  }) => {
    const [form] = Form.useForm();
    //set field value
    form.setFieldValue("email", record.email);
    form.setFieldValue("role", record.role);
    form.setFieldValue("userClass", record.userClass);
    return (
      //用Modal弹出表单
      <Modal
        open={open} //是
        title="修改用户信息"
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
              fetch(`https://47.120.14.174:443/petHospital/users/` + record.userId, {
                method: 'PATCH',
                body: JSON.stringify({
                  "userId": record.userId,
                  "password": '',
                  "email": values.email,
                  "role": values.role,
                  "userClass": values.userClass
                }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                }
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data)
                  // 获取实际修改的数目
                  if (data.success === true) {
                    let res = data.result.modifiedRecordCount;
                    console.log(res)
                    if (res === 1) {
                      message.success("修改成功！");
                      setCount(count + 1); //数据页面更新
                    }
                    else {
                      message.error("修改失败，请稍后再试！")
                    }
                  } else {
                    message.error("修改失败，请稍后再试！")
                  }

                })
                .catch((err) => {
                  message.error("修改失败，请稍后再试！")
                  console.log(err.message);
                });
              console.log('修改后：' + values.email + ' ' + values.role + ' ' + values.userClass)

            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          {/* 填写邮箱 */}
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: 'Please input email!' }]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} />
          </Form.Item>

          {/* 选择角色 */}
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select >
              <Option value="student">student</Option>
              <Option value="manager">manager</Option>
            </Select>
          </Form.Item>

          {/* 选择班级 */}
          <Form.Item
            name="userClass"
            label="班级"
            rules={[{ required: true, message: 'Please input class!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    )
  };

  //删除操作
  const del = (id: number) => {
    console.log("点击删除id为" + id + "的用户");
    //弹出对话框 是否删除？
    showDeleteConfirm(id);
  }

  // TODO: 批量删除
  const batchDel = () => {
    confirm({
      title: '确认批量删除这些用户吗？',
      icon: <ExclamationCircleFilled />,
      // content: '用户id为:' + id,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        console.log('要删除：' + userList)
        //删除的事件 DELETE
        fetch(`https://47.120.14.174:443/petHospital/users/batch`, {
          method: 'POST',
          body: JSON.stringify(userList),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }).then((response) => response.json())
          .then((data) => {
            console.log(data);
            let res = data.success;
            if (res === true) {
              if (data.result.modifiedRecordCount !== 0) {
                message.success("删除成功！");
              }
              else message.error("删除失败，请稍后再试！");
            }
            else {
              message.error("删除失败，请稍后再试！");
            }
            setCount(count + 1); // 刷新界面
          })
          .catch((err) => {
            console.log(err.message);
            message.error("删除失败，请稍后再试！");
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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
        await fetch(`https://47.120.14.174:443/petHospital/users/${id}`, {
          method: 'DELETE',
        }).then((response) => {
          if (response.status === 200) {
            //DONE：重新加载数据 filter一下
            setUserData(
              userData.filter((data) => {
                return data.userId !== id
              })
            )
            console.log('删除成功！')
            //返回删除成功的提示
            message.success("删除成功！")
          } else {
            console.log('删除失败！')
            message.error("删除失败，请重试！")
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
      title: '序号',
      dataIndex: 'key',
      align: 'center',
      render: (text, record, index) => `${text + 1}`,
      width: '10%'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      width: '30%',
      // key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: '班级',
      dataIndex: 'userClass',
      align: 'center',
      width: '20%'
    },
    {
      title: '角色',
      dataIndex: 'role',
      align: 'center',
      render: (text, record) => (
        <Tag color={text === 'manager' ? 'green' : 'blue'}>
          {text}
        </Tag>
      )
    },
    {
      title: '操作',
      align: 'center',
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




  return (
    userData ? (
      <div style={{margin: 16}}>
        <Space size={700}>
          <Space>
            <Button type="primary" onClick={reload} disabled={!hasSelected} loading={loading}>
              Reload
            </Button>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `选择了 ${selectedRowKeys.length} 个用户` : ''}
            </span>
          </Space>
          <Space wrap>
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

        <Table rowSelection={rowSelection} rowKey={record => record.key} columns={columns} dataSource={userData} style={{ margin: 16 }} pagination={{ position: ['bottomCenter'] }} />
      </div >
    ) : (
      <>
        <Loading />
      </>
    )
  );
};

export default UserInfo;