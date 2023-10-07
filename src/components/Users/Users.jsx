import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/user_service";

const { Item } = Form;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      message.error("Failed to load users");
    }
  };

  const showModal = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
    form.setFieldsValue(user);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success("User updated successfully");
      } else {
        await createUser(values);
        message.success("User created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error handling user:", error);
      message.error("Failed to handle user");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingUser(null);
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Users</h1>
      <Button
        type="primary"
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 }}
      >
        Add User
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Item label="Username" name="username" rules={[{ required: true }]}>
            <Input />
          </Item>
          <Item label="Password" name="password" rules={[{ required: true }]}>
            <Input type="password" />
          </Item>
          <Item label="Role" name="role" rules={[{ required: true }]}>
            <Select placeholder="Select a role">
              <Option value="TravelAgent">Travel Agent</Option>
              <Option value="Backoffice">Backoffice</Option>
            </Select>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
