import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import Table from "./Table";
import EditCategory from "./EditCategory";

const CategoriesTable = ({ refresh }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    const categoriesCollection = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesCollection);
    const categoriesList = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(categoriesList);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteDoc(doc(db, "categories", categoryId));
      fetchCategories(); // Refresh the categories list after deletion
    }
  };

  const headers = ["Name", "Actions"];

  const renderRow = (category) => (
    <tr key={category.id}>
      <td className="py-2 px-4 border-b border-gray-200">{category.name}</td>
      <td className="py-2 px-4 border-b border-gray-200">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          onClick={() => setEditCategory(category)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => handleDelete(category.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {editCategory && (
        <EditCategory
          category={editCategory}
          onSave={() => {
            setEditCategory(null);
            fetchCategories();
          }}
          onClose={() => setEditCategory(null)} // Pass the onClose prop
        />
      )}
      <Table headers={headers} data={categories} renderRow={renderRow} />
    </div>
  );
};

export default CategoriesTable;
