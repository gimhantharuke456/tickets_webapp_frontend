import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Switch } from "antd";
import {
  getTravellers,
  updateTraveller,
  deleteTraveller,
} from "../../services/traveller_service";
import Title from "antd/es/skeleton/Title";

const Travellers = () => {
  const [travellers, setTravellers] = useState([]);

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

  const handleUpdateStatus = async (id, status, data) => {
    try {
      const newtraveller = {
        ...data,
        accountStatus: status ? "Active" : "Not Active",
      };

      const updatedTraveller = await updateTraveller(id, newtraveller);

      await loadTravellers();
      message.success("Traveller status updated successfully");
    } catch (error) {
      console.error("Error updating traveller status:", error);
      message.error("Failed to update traveller status");
    }
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
      key: "firstName",
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active, record) => (
        <Switch
          checked={record.accountStatus == "Active"}
          onChange={(checked) => handleUpdateStatus(record.id, checked, record)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this traveller?"
          onConfirm={() => handleDeleteTraveller(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h1>Travellers</h1>
      <Table dataSource={travellers} columns={columns} rowKey="id" />
    </div>
  );
};

export default Travellers;
