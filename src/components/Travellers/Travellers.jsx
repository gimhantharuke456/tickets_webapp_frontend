import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Switch,
  Modal,
  Form,
  Input,
} from "antd";
import {
  getTravellers,
  createTraveller,
  updateTraveller,
  deleteTraveller,
} from "../../services/traveller_service";

const { Item } = Form;

const Travellers = () => {
  const [travellers, setTravellers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTraveller, setEditingTraveller] = useState(null);

  useEffect(() => {
    loadTravellers();
  }, []);

  const loadTravellers = async () => {
    try {
      const data = await getTravellers();
      setTravellers(data);
    } catch (error) {
      console.error("Error loading travellers:", error);
      // Handle error, show message, etc.
    }
  };

  const showModal = (traveller) => {
    setEditingTraveller(traveller);
    setIsModalVisible(true);
    form.setFieldsValue(traveller);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingTraveller) {
        await updateTraveller(editingTraveller.id, {
          ...values,
          accountStatus: values.accountStatus == true ? "Active" : "Not Active",
        });
        message.success("Traveller updated successfully");
      } else {
        await createTraveller({
          ...values,
          accountStatus: values.accountStatus == true ? "Active" : "Not Active",
        });
        message.success("Traveller created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingTraveller(null);
      loadTravellers();
    } catch (error) {
      console.error("Error handling traveller:", error);
      message.error("Failed to handle traveller");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTraveller(null);
  };

  const handleDeleteTraveller = async (id) => {
    try {
      await deleteTraveller(id);

      setTravellers((prevTravellers) =>
        prevTravellers.filter((traveller) => traveller.id !== id)
      );
      message.success("Traveller deleted successfully");
    } catch (error) {
      console.error("Error deleting traveller:", error);
      message.error("Failed to delete traveller");
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this traveller?"
            onConfirm={() => handleDeleteTraveller(record.id)}
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
      <h1>Travellers</h1>
      <Button
        type="primary"
        onClick={() => showModal(null)}
        style={{ marginBottom: 16 }}
      >
        Add Traveller
      </Button>
      <Table dataSource={travellers} columns={columns} rowKey="id" />

      <Modal
        title={editingTraveller ? "Edit Traveller" : "Add Traveller"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Item>
          <Item label="Last Name" name="lastName" rules={[{ required: true }]}>
            <Input />
          </Item>
          <Item label="NIC" name="nic" rules={[{ required: true }]}>
            <Input />
          </Item>
          <Item label="Password" name="password" rules={[{ required: true }]}>
            <Input type="password" />
          </Item>
          <Item label="Status" name="accountStatus">
            <Switch />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Travellers;
