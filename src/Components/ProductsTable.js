// src/Components/ProductsTable.js
import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase";
import Table from "./Table";
import EditProduct from "./EditProduct";

const ProductsTable = ({ refresh, categoryFilter }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let productsCollection = collection(db, "products");

    if (categoryFilter) {
      productsCollection = query(
        productsCollection,
        where("category", "==", categoryFilter)
      );
    } else {
      productsCollection = collection(db, "products"); // Get all products
    }

    const productsSnapshot = await getDocs(productsCollection);
    const productsList = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsList);
    setLoading(false);
  }, [categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [refresh, categoryFilter, fetchProducts]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", productId));
      fetchProducts(); // Refresh the product list after deletion
    }
  };

  const headers = ["Name", "Description", "Barcode ID", "Price", "Actions"];

  const renderRow = (product) => (
    <tr key={product.id}>
      <td className="py-2 px-4 border-b border-gray-200">{product.name}</td>
      <td className="py-2 px-4 border-b border-gray-200">
        {product.description}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">
        {product.barcode_id}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">{product.price}</td>
      <td className="py-2 px-4 border-b border-gray-200">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          onClick={() => setEditProduct(product)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => handleDelete(product.id)}
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
      {editProduct && (
        <EditProduct
          product={editProduct}
          onSave={() => {
            setEditProduct(null);
            fetchProducts();
          }}
          onClose={() => setEditProduct(null)}
        />
      )}
      <Table headers={headers} data={products} renderRow={renderRow} />
    </div>
  );
};

export default ProductsTable;
