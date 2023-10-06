// Import the necessary components and functions
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
  Select,
} from "antd";
import moment from "moment";
import {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../../services/reservation_service";
import { getTravellers } from "../../services/traveller_service";
import { getTrains } from "../../services/train_service";

const { Column } = Table;
const { Item } = Form;
const { Option } = Select;

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [travellers, setTravellers] = useState([]);
  const [trains, setTrains] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingReservation, setEditingReservation] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error("Error loading reservations:", error);
      message.error(`${error}`);
    }
  };

  const loadTravellers = async () => {
    try {
      const data = await getTravellers();
      setTravellers(data);
    } catch (error) {
      console.error("Error loading travellers:", error);
      message.error(`${error}`);
    }
  };

  const loadTrains = async () => {
    try {
      const data = await getTrains();
      setTrains(data);
    } catch (error) {
      console.error("Error loading trains:", error);
      message.error(`${error}`);
    }
  };

  const showModal = async () => {
    try {
      await loadTravellers();
      await loadTrains();
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error loading data:", error);
      message.error("Failed to load data");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingReservation) {
        await updateReservation(editingReservation.id, values);
        message.success("Reservation updated successfully");
      } else {
        await createReservation(values);
        message.success("Reservation created successfully");
      }
      setIsModalVisible(false);
      loadReservations();
    } catch (error) {
      //console.error("Error handling reservation:", error);
      message.error(`${error}`);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setUserData(null);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    if (reservation) {
      form.setFieldsValue({
        referenceId: reservation.referenceId,
        reservationDate: moment(reservation.reservationDate),
        status: reservation.status,
        createdBy: reservation.createdBy,
        createdTo: reservation.createdTo,
      });
    } else {
      form.resetFields();
    }

    showModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteReservation(id);
      message.success("Reservation deleted successfully");
      loadReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error);
      message.error(`${error.message}`);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          form.resetFields();
          setUserData(null);
          setEditingReservation(null);
          setTimeout(() => {
            showModal();
          }, 1000);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Reservation
      </Button>
      <Table dataSource={reservations} rowKey="id">
        <Column title="ID" key="Id" dataIndex={"id"} />
        <Column
          title="Reservation Date"
          dataIndex="reservationDate"
          key="reservationDate"
          render={(text) => moment(text).format("YYYY-MM-DD HH:mm:ss")}
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
                title="Are you sure you want to delete this reservation?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </>
          )}
        />
      </Table>
      <Modal
        title={editingReservation ? "Edit Reservation" : "Add Reservation"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          initialValues={{
            reservationDate: editingReservation
              ? moment(editingReservation.reservationDate)
              : undefined,
            status: editingReservation ? editingReservation.status : undefined,
            createdBy: editingReservation
              ? editingReservation.createdBy
              : undefined,
            createdTo: editingReservation
              ? editingReservation.createdTo
              : undefined,
          }}
          form={form}
          layout="vertical"
        >
          <Item
            label="Reservation Date"
            name="reservationDate"
            rules={[{ required: true }]}
          >
            <DatePicker
              showTime
              disabledDate={(current) =>
                current &&
                (current < moment().startOf("day") ||
                  current > moment().add(30, "days"))
              }
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
            />
          </Item>
          <Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select a status">
              <Option value="Active">Active</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Item>
          <Item
            label="Traveller"
            name="createdBy"
            rules={[{ required: true, message: "Please select a traveller" }]}
          >
            <Select placeholder="Select a traveller">
              {travellers.map((traveller) => (
                <Option key={traveller.id} value={traveller.id}>
                  {`${traveller.firstName} ${traveller.lastName}`}
                </Option>
              ))}
            </Select>
          </Item>
          <Item
            label="Train"
            name="createdTo"
            rules={[{ required: true, message: "Please select a train" }]}
          >
            <Select placeholder="Select a train">
              {trains.map((train) => (
                <Option key={train.id} value={train.id}>
                  {train.trainName}
                </Option>
              ))}
            </Select>
          </Item>
        </Form>
        {userData && (
          <div>
            <h2>User Data</h2>
            <p>ID: {userData.id}</p>
            <p>NIC: {userData.nic}</p>
            <p>First Name: {userData.firstName}</p>
            <p>Last Name: {userData.lastName}</p>
            <p>Account Status: {userData.accountStatus}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Reservations;
