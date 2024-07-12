// src/Components/OrdersTable.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import Table from "./Table";
import EditOrderForm from "./EditOrderForm";

const OrdersTable = ({ refresh }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOrder, setEditOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const ordersCollection = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersCollection);
    const ordersList = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(ordersList);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteDoc(doc(db, "orders", orderId));
      fetchOrders(); // Refresh the order list after deletion
    }
  };

  const headers = ["Name", "Price", "Actions"];

  const renderRow = (order) => (
    <tr key={order.id}>
      <td className="py-2 px-4 border-b border-gray-200">{order.name}</td>
      <td className="py-2 px-4 border-b border-gray-200">{order.price}</td>
      <td className="py-2 px-4 border-b border-gray-200">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          onClick={() => setEditOrder(order)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => handleDelete(order.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {editOrder && (
        <EditOrderForm
          order={editOrder}
          onSave={() => {
            setEditOrder(null);
            fetchOrders();
          }}
        />
      )}
      <Table headers={headers} data={orders} renderRow={renderRow} />
    </div>
  );
};

export default OrdersTable;
