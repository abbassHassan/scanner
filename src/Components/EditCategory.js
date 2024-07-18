import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";

const EditCategory = ({ category, onSave, onClose }) => {
  const [name, setName] = useState(category.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCategory = { name };
    try {
      await updateDoc(doc(db, "categories", category.id), updatedCategory);
      onSave(); // Call the onSave prop to refresh the category list
    } catch (e) {
      console.error("Error updating document: ", e);
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
      <h2 className="text-xl mb-4">Edit Category</h2>
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
        Save Changes
      </button>
    </form>
  );
};

export default EditCategory;
