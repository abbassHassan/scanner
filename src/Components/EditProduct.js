import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../Firebase";
import Select from "react-select";

const EditProduct = ({ product, onSave }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [barcodeId, setBarcodeId] = useState(product.barcode_id);
  const [price, setPrice] = useState(product.price);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        value: doc.ref,
        label: doc.data().name,
      }));
      setCategories(categoriesList);

      if (product.category && typeof product.category === "object") {
        const categoryDoc = categoriesList.find(
          (cat) => cat.value.id === product.category.id
        );
        const categoryLabel = categoryDoc
          ? categoryDoc.label
          : product.category.id.split("/").pop();
        setSelectedCategory({ value: product.category, label: categoryLabel });
      }
    };

    fetchCategories();
  }, [product.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      name,
      description,
      barcode_id: barcodeId,
      price: parseFloat(price),
      category: selectedCategory ? selectedCategory.value : null,
    };
    try {
      await updateDoc(doc(db, "products", product.id), updatedProduct);
      onSave(); // Call the onSave prop to refresh the product list
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-xl mb-4">Edit Product</h2>
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
        <label className="block mb-1" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1" htmlFor="barcodeId">
          Barcode ID
        </label>
        <input
          id="barcodeId"
          type="text"
          value={barcodeId}
          onChange={(e) => setBarcodeId(e.target.value)}
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
      <div className="mb-2">
        <label className="block mb-1" htmlFor="category">
          Category
        </label>
        <Select
          id="category"
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full"
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

export default EditProduct;
