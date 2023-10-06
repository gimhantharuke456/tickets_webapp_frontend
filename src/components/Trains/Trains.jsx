import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  DatePicker,
} from "antd";
import moment from "moment";
import {
  getTrains,
  createTrain,
  updateTrain,
  deleteTrain,
} from "../../services/train_service";

const { Column } = Table;
const { Item } = Form;

const Trains = () => {
  const [trains, setTrains] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTrain, setEditingTrain] = useState(null);

  useEffect(() => {
    loadTrains();
  }, []);

  const loadTrains = async () => {
    try {
      const data = await getTrains();
      setTrains(data);
    } catch (error) {
      console.error("Error loading trains:", error);
      message.error(`${error}`);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTrain) {
        await updateTrain(editingTrain.id, values);
        message.success("Train updated successfully");
      } else {
        await createTrain(values);
        message.success("Train created successfully");
      }
      setIsModalVisible(false);
      loadTrains();
    } catch (error) {
      console.error("Error handling train:", error);
      message.error(`${error.message}`);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (train) => {
    setEditingTrain(train);
    if (train) {
      form.setFieldsValue({ trainName: train.trainName, status: train.status });
    } else {
      form.resetFields();
    }

    showModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrain(id);
      message.success("Train deleted successfully");
      loadTrains();
    } catch (error) {
      console.error("Error deleting train:", error);

      message.error(`${error.message}`);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          form.resetFields();
          setEditingTrain(null);
          showModal();
        }}
        style={{ marginBottom: 16 }}
      >
        Add Train
      </Button>
      <Table dataSource={trains} rowKey="id">
        <Column title="Train Name" dataIndex="trainName" key="trainName" />
        <Column
          title="Schedule"
          key="schedule"
          render={(_, record) => (
            <p>{`${moment(record.schedule).format("YYYY-MM-DD HH:mm:ss")}`}</p>
          )}
        />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <>
              <Button type="link" onClick={() => handleEdit(record)}>
                Edit
              </Button>
              <Popconfirm
                title="Are you sure you want to delete this train?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger>
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
        />
      </Table>
      <Modal
        title={editingTrain ? "Edit Train" : "Add Train"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Item
            label="Train Name"
            name="trainName"
            rules={[{ required: true }]}
          >
            <Input />
          </Item>
          <Item label="Schedule" name="schedule" rules={[{ required: true }]}>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              defaultValue={moment("00:00", "HH:mm")}
              style={{ width: "100%" }}
            />
          </Item>
          <Item label="Status" name="status" rules={[{ required: true }]}>
            <Input />
          </Item>
        </Form>
      </Modal>
    </>
  );
};

export default Trains;
