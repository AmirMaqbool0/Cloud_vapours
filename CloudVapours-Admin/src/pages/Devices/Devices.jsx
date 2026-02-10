import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiUpload,
  FiX,
} from "react-icons/fi";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import "./style.css";
import Header from "../../components/Header/Header";
import { app } from "../../firebase";

const Devices = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: "",
          flavor: [],
          nicotine_strengths: [],
          puff_counts: [],
          features: [],
          price: "",
          original_price: "",
          images: [],
          ...doc.data(),
        }));
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [db]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "Products", productId));
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowAddModal(true);
  };

  const handleAddOrUpdateProduct = async (productData) => {
    try {
      if (productData.id) {
        // Update existing product
        await setDoc(doc(db, "Products", productData.id), productData);
        setProducts(
          products.map((p) => (p.id === productData.id ? productData : p))
        );
      } else {
        // Add new product
        const docRef = await addDoc(collection(db, "Products"), productData);
        setProducts([...products, { ...productData, id: docRef.id }]);
      }
    } catch (error) {
      console.error("Error saving product: ", error);
      throw error;
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="devices-container">
      <Header />
      <div className="all-devices">
        <div className="devices-header">
          <h2>All Products</h2>
          <div className="devices-actions">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="add-product-btn"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus /> Add Product
            </button>
          </div>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Flavors</th>
                <th>Nicotine Strengths</th>
                <th>Puff Counts</th>
                <th>Price</th>
                <th>Original Price</th>
                <th>Features</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.images?.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="product-img"
                        />
                      )}
                    </td>
                    <td>{product.name || "-"}</td>
                    <td>
                      <ul className="features-list">
                        {product.flavor?.map((flavor, index) => (
                          <li key={index}>{flavor}</li>
                        ))}
                        {product.flavor?.length === 0 && <li>-</li>}
                      </ul>
                    </td>
                    <td>
                      <ul className="features-list">
                        {product.nicotine_strengths?.map((strength, index) => (
                          <li key={index}>{strength}mg</li>
                        ))}
                        {product.nicotine_strengths?.length === 0 && <li>-</li>}
                      </ul>
                    </td>
                    <td>
                      <ul className="features-list">
                        {product.puff_counts?.map((count, index) => (
                          <li key={index}>{count}</li>
                        ))}
                        {product.puff_counts?.length === 0 && <li>-</li>}
                      </ul>
                    </td>
                    <td>${product.price || "0.00"}</td>
                    <td>${product.original_price || "0.00"}</td>
                    <td>
                      <ul className="features-list">
                        {product.features?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                        {product.features?.length === 0 && <li>-</li>}
                      </ul>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(product)}
                          className="edit-btn"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="delete-btn"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-products">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <ProductModal
          product={editProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditProduct(null);
          }}
          onSave={handleAddOrUpdateProduct}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    flavor: product?.flavor || [],
    nicotine_strengths: product?.nicotine_strengths || [],
    puff_counts: product?.puff_counts || [],
    features: product?.features || [],
    price: product?.price || "",
    original_price: product?.original_price || "",
    images: product?.images || [],
  });

  const [newFlavor, setNewFlavor] = useState("");
  const [newStrength, setNewStrength] = useState("");
  const [newPuffCount, setNewPuffCount] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({
        ...formData,
        ...(product?.id && { id: product.id }),
      });
      onClose();
    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const uploadImageToCloudinary = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cloudVapours");
      formData.append("cloud_name", "dgas13tyw");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dgas13tyw/image/upload`,
        {
          method: "POST",
          body: formData,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
      const imageUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addToList = (field, value, setValue) => {
    if (value.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
      setValue("");
    }
  };

  const removeFromList = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <h2>{product ? "Edit Product" : "Add New Product"}</h2>
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Product Images</label>
            <div className="image-upload-container">
              <label className="upload-btn">
                <FiUpload /> Upload Images
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </label>
              {uploading && (
                <div className="upload-progress">
                  <progress value={uploadProgress} max="100" />
                  <span>{uploadProgress}%</span>
                </div>
              )}
              <div className="image-preview">
                {formData.images.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={img} alt={`Preview ${index}`} />
                    <button type="button" onClick={() => removeImage(index)}>
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Flavors</label>
            <div className="list-input">
              <input
                type="text"
                value={newFlavor}
                onChange={(e) => setNewFlavor(e.target.value)}
                placeholder="Add flavor"
              />
              <button
                type="button"
                onClick={() => addToList("flavor", newFlavor, setNewFlavor)}
              >
                Add
              </button>
            </div>
            <ul className="form-list">
              {formData.flavor.map((item, index) => (
                <li key={index}>
                  {item}
                  <button
                    type="button"
                    onClick={() => removeFromList("flavor", index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group">
            <label>Nicotine Strengths (mg)</label>
            <div className="list-input">
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                placeholder="Add strength"
              />
              <button
                type="button"
                onClick={() =>
                  addToList("nicotine_strengths", newStrength, setNewStrength)
                }
              >
                Add
              </button>
            </div>
            <ul className="form-list">
              {formData.nicotine_strengths.map((item, index) => (
                <li key={index}>
                  {item}
                  <button
                    type="button"
                    onClick={() => removeFromList("nicotine_strengths", index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group">
            <label>Puff Counts</label>
            <div className="list-input">
              <input
                type="text"
                value={newPuffCount}
                onChange={(e) => setNewPuffCount(e.target.value)}
                placeholder="Add puff count"
              />
              <button
                type="button"
                onClick={() =>
                  addToList("puff_counts", newPuffCount, setNewPuffCount)
                }
              >
                Add
              </button>
            </div>
            <ul className="form-list">
              {formData.puff_counts.map((item, index) => (
                <li key={index}>
                  {item}
                  <button
                    type="button"
                    onClick={() => removeFromList("puff_counts", index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group">
            <label>Features</label>
            <div className="list-input">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature"
              />
              <button
                type="button"
                onClick={() => addToList("features", newFeature, setNewFeature)}
              >
                Add
              </button>
            </div>
            <ul className="form-list">
              {formData.features.map((item, index) => (
                <li key={index}>
                  {item}
                  <button
                    type="button"
                    onClick={() => removeFromList("features", index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Original Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.original_price}
              onChange={(e) =>
                setFormData({ ...formData, original_price: e.target.value })
              }
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {product ? "Update" : "Add"} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Devices;
