// src/Pages/Products.js
import React, { useState } from "react";
import ProductsTable from "../Components/ProductsTable";
import AddProduct from "../Components/AddProduct";

const Products = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAddItem = () => {
    setShowForm(!showForm);
  };

  const handleAddProduct = () => {
    setRefresh(!refresh); // Toggle the refresh state to trigger a refresh in ProductsTable
    setShowForm(false); // Hide the form after adding the product
  };

  return (
    <div>
      <h2 className="text-3xl mb-4">Products</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </div>
      {showForm && <AddProduct onAdd={handleAddProduct} />}
      <ProductsTable refresh={refresh} />
    </div>
  );
};

export default Products;
