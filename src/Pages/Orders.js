// src/Pages/Orders.js
import React, { useState } from "react";
import OrdersTable from "../Components/OrdersTable";
import AddOrderForm from "../Components/AddOrderForm"; // Ensure correct path and name

const Orders = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAddItem = () => {
    setShowForm(!showForm);
  };

  const handleAddOrder = () => {
    setRefresh(!refresh);
    setShowForm(false);
  };

  return (
    <div>
      <h2 className="text-3xl mb-4">Orders</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddItem}
        >
          Add Order
        </button>
      </div>
      {showForm && <AddOrderForm onAdd={handleAddOrder} />}
      <OrdersTable refresh={refresh} />
    </div>
  );
};

export default Orders;
