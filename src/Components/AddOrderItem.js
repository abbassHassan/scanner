// src/Components/AddOrderItem.js
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../Firebase";
import Select from "react-select";

const AddOrderItem = ({ onAdd }) => {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
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
    };

    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        value: doc.ref.path,
        label: doc.data().name,
      }));
      setProducts(productsList);
    };

    fetchOrders();
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newOrderItem = {
      order: doc(db, selectedOrder.value),
      product: doc(db, selectedProduct.value),
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };
    try {
      await addDoc(collection(db, "order_items"), newOrderItem);
      onAdd(); // Call the onAdd prop to trigger a refresh
      setPrice("");
      setQuantity("");
      setSelectedOrder(null);
      setSelectedProduct(null);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="mb-4 p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4">Add New Order Item</h2>
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
          Add Order Item
        </button>
      </form>
    </div>
  );
};

export default AddOrderItem;
