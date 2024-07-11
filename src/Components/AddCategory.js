// src/Components/AddCategory.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../Firebase";

const AddCategory = ({ onAdd }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCategory = { name };
    try {
      const docRef = await addDoc(collection(db, "categories"), newCategory);
      console.log("Document written with ID: ", docRef.id);
      onAdd();
      setName("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-xl mb-4">Add New Category</h2>
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Category
      </button>
    </form>
  );
};

export default AddCategory;
