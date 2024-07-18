import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../Firebase";

const AddOrderForm = ({ onAdd, onClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newOrder = { name, price: parseFloat(price) };
    try {
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      console.log("Document written with ID: ", docRef.id);
      onAdd();
      setName("");
      setPrice("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mb-4 p-4 bg-white shadow-md rounded"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <h2 className="text-xl mb-4">Add New Order</h2>
      <div className="mb-2">
        <label className="block mb-1" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Order
      </button>
    </form>
  );
};

export default AddOrderForm;
