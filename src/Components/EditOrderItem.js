import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import Select from "react-select";

const EditOrderItem = ({ orderItem, onSave, onClose }) => {
  const [price, setPrice] = useState(orderItem.price);
  const [quantity, setQuantity] = useState(orderItem.quantity);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map((doc) => ({
        value: doc.ref.path,
        label: doc.data().name || doc.id,
      }));
      setOrders(ordersList);

      const initialOrderDoc = await getDoc(doc(db, orderItem.order));
      const initialOrder = {
        value: orderItem.order,
        label: initialOrderDoc.exists()
          ? initialOrderDoc.data().name || initialOrderDoc.id
          : orderItem.order,
      };
      setSelectedOrder(initialOrder);
    };

    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        value: doc.ref.path,
        label: doc.data().name, // Use the product name
      }));
      setProducts(productsList);

      const initialProductDoc = await getDoc(doc(db, orderItem.product));
      const initialProduct = {
        value: orderItem.product,
        label: initialProductDoc.exists()
          ? initialProductDoc.data().name
          : orderItem.product,
      };
      setSelectedProduct(initialProduct);
    };

    fetchOrders();
    fetchProducts();
  }, [orderItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedOrderItem = {
      order: selectedOrder.value,
      product: selectedProduct.value,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };
    try {
      await updateDoc(doc(db, "order_items", orderItem.id), updatedOrderItem);
      onSave(); // Call the onSave prop to refresh the order item list
      onClose(); // Close the edit form
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <div className="relative mb-4 p-4 bg-white shadow-md rounded">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <h2 className="text-xl mb-4">Edit Order Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1" htmlFor="order">
            Order
          </label>
          <Select
            id="order"
            options={orders}
            value={selectedOrder}
            onChange={setSelectedOrder}
            className="w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1" htmlFor="product">
            Product
          </label>
          <Select
            id="product"
            options={products}
            value={selectedProduct}
            onChange={setSelectedProduct}
            className="w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditOrderItem;
