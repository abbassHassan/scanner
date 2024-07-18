import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db, storage } from "../Firebase";
import Select from "react-select";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProduct = ({ product, onSave }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [barcodeId, setBarcodeId] = useState(product.barcode_id);
  const [price, setPrice] = useState(product.price);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageUrl, setImageUrl] = useState(product.image_url || "");

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

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `products/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setImageUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      name,
      description,
      barcode_id: barcodeId,
      price: parseFloat(price),
      category: selectedCategory ? selectedCategory.value : null,
      image_url: imageUrl,
    };
    try {
      await updateDoc(doc(db, "products", product.id), updatedProduct);
      onSave(); // Call the onSave prop to refresh the product list
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
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
      <div className="mb-2 flex items-center">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Product"
            className="w-20 h-20 object-cover mt-4 mr-4"
          />
        )}
        <div>
          <label className="block mb-1" htmlFor="image">
            Change Image
          </label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
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
