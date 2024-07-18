import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import Table from "./Table";
import EditOrderItem from "./EditOrderItem";

const OrderItemsTable = ({ refresh }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOrderItem, setEditOrderItem] = useState(null);

  const fetchOrderItems = useCallback(async () => {
    setLoading(true);
    const orderItemsCollection = collection(db, "order_items");
    const orderItemsSnapshot = await getDocs(orderItemsCollection);
    const orderItemsList = await Promise.all(
      orderItemsSnapshot.docs.map(async (orderItemDoc) => {
        const orderItemData = orderItemDoc.data();

        const orderPath = orderItemData.order.path || orderItemData.order;
        const productPath = orderItemData.product.path || orderItemData.product;

        const orderDoc = await getDoc(doc(db, orderPath));
        const productDoc = await getDoc(doc(db, productPath));

        return {
          id: orderItemDoc.id,
          orderName:
            orderDoc && orderDoc.exists()
              ? orderDoc.data().name || orderDoc.id
              : "Unknown Order",
          productName:
            productDoc && productDoc.exists()
              ? productDoc.data().name || productDoc.id
              : "Unknown Product",
          ...orderItemData,
        };
      })
    );
    setOrderItems(orderItemsList);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrderItems();
  }, [refresh, fetchOrderItems]);

  const handleDelete = async (orderItemId) => {
    if (window.confirm("Are you sure you want to delete this order item?")) {
      await deleteDoc(doc(db, "order_items", orderItemId));
      fetchOrderItems(); // Refresh the order item list after deletion
    }
  };

  const headers = ["Order", "Product", "Price", "Quantity", "Actions"];

  const renderRow = (orderItem) => (
    <tr key={orderItem.id}>
      <td className="py-2 px-4 border-b border-gray-200">
        {orderItem.orderName}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">
        {orderItem.productName}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">{orderItem.price}</td>
      <td className="py-2 px-4 border-b border-gray-200">
        {orderItem.quantity}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          onClick={() => setEditOrderItem(orderItem)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => handleDelete(orderItem.id)}
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
      {editOrderItem && (
        <EditOrderItem
          orderItem={editOrderItem}
          onSave={() => {
            setEditOrderItem(null);
            fetchOrderItems();
          }}
          onClose={() => setEditOrderItem(null)} // Pass the onClose prop
        />
      )}
      <Table headers={headers} data={orderItems} renderRow={renderRow} />
    </div>
  );
};

export default OrderItemsTable;
