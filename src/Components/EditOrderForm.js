// src/Components/EditOrderForm.js
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";

const EditOrderForm = ({ order, onSave }) => {
  const [name, setName] = useState(order.name);
  const [price, setPrice] = useState(order.price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedOrder = { name, price: parseFloat(price) };
    try {
      await updateDoc(doc(db, "orders", order.id), updatedOrder);
      onSave();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-xl mb-4">Edit Order</h2>
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
        Save Changes
      </button>
    </form>
  );
};

export default EditOrderForm;
