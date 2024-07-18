import React, { useState, useEffect } from "react";
import ProductsTable from "../Components/ProductsTable";
import AddProduct from "../Components/AddProduct";
import Select from "react-select";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

const Products = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        value: doc.ref.path,
        label: doc.data().name,
      }));
      categoriesList.unshift({ value: null, label: "All Categories" });
      setCategories(categoriesList);
    };

    fetchCategories();
  }, []);

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
        <Select
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Select Category"
          className="w-64"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </div>
      {showForm && <AddProduct onAdd={handleAddProduct} />}
      <ProductsTable
        refresh={refresh}
        categoryFilter={selectedCategory?.value}
      />
    </div>
  );
};

export default Products;
