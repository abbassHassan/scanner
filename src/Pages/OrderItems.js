// src/Pages/OrderItems.js
import React, { useState } from "react";
import OrderItemsTable from "../Components/OrderItemsTable";
import AddOrderItem from "../Components/AddOrderItem";

const OrderItems = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAddItem = () => {
    setShowForm(!showForm);
  };

  const handleAddOrderItem = () => {
    setRefresh(!refresh); // Toggle the refresh state to trigger a refresh in OrderItemsTable
    setShowForm(false); // Hide the form after adding the order item
  };

  return (
    <div>
      <h2 className="text-3xl mb-4">Order Items</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddItem}
        >
          Add Order Item
        </button>
      </div>
      {showForm && <AddOrderItem onAdd={handleAddOrderItem} />}
      <OrderItemsTable refresh={refresh} />
    </div>
  );
};

export default OrderItems;
