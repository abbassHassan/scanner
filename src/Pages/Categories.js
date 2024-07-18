// src/Pages/Categories.js
import React, { useState } from "react";
import CategoriesTable from "../Components/CategoriesTable";
import AddCategory from "../Components/AddCategory";

const Categories = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAddItem = () => {
    setShowForm(!showForm);
  };

  const handleAddCategory = () => {
    setRefresh(!refresh);
    setShowForm(false);
  };

  return (
    <div>
      <h2 className="text-3xl mb-4">Categories</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddItem}
        >
          Add Category
        </button>
      </div>
      {showForm && <AddCategory onAdd={handleAddCategory} />}
      <CategoriesTable refresh={refresh} />
    </div>
  );
};

export default Categories;
