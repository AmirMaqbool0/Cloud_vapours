import React, { useEffect, useState } from "react";
import "./style.css";
import Header from "../../components/Header/Header";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { app } from "../../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("Hayati Pro Max 6000");
  const [selectedType, setSelectedType] = useState("Flavour");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(app);

  const getProducts = async () => {
    try {
      const collectionRef = collection(db, "flavores");
      const result = await getDocs(collectionRef);
      const arr = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(arr);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.deviceName?.toLowerCase() === selectedDevice.toLowerCase() &&
        product.type?.toLowerCase() === selectedType.toLowerCase() &&
        (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [products, selectedDevice, selectedType, searchTerm]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "flavores", productId));
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleAddProduct = async (productData) => {
    try {
      const docRef = await addDoc(collection(db, "flavores"), productData);
      setProducts([...products, { id: docRef.id, ...productData }]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await updateDoc(doc(db, "flavores", productData.id), productData);
      setProducts(
        products.map((p) => (p.id === productData.id ? productData : p))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  return (
    <div className="product-container">
      <Header />
      <div className="products-content">
        <div className="products-header">
          <div className="product-header-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="add-pro-btn" onClick={() => setShowAddModal(true)}>
            <Plus color="white" size={18} />
            <span>Add Product</span>
          </div>
        </div>

        <div className="filters">
          <div className="device-filter">
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              <option value="Hayati Pro Max 6000">Hayati Pro Max 6000</option>
              <option value="Hayati Rubik 7000">Hayati Rubik 7000</option>
              <option value="Crystal Pro Switch 30K">
                Crystal Pro Switch 30K
              </option>
              <option value="Crystal Pro CP 10K">Crystal Pro CP 10K</option>
              <option value="Hayati mini 1500">Hayati mini 1500</option>
            </select>
          </div>
          <div className="type-filter">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="Flavour">Flavour</option>
              <option value="Refiller">Refiller</option>
              <option value="Bundel">Bundle</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">
            No products found matching your criteria
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Device</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Sizes</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="image-placeholder">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td>{product.name || "-"}</td>
                    <td>{product.deviceName || "-"}</td>
                    <td className="description-cell">
                      {product.description || "-"}
                    </td>
                    <td>{product.type || "-"}</td>
                    <td>{product.sizes?.join(", ") || "-"}</td>
                    <td>${product.price || "0.00"}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleEdit(product)}
                          className="edit-btn"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="delete-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <ProductModal
          mode="edit"
          product={currentProduct}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateProduct}
        />
      )}
    </div>
  );
};

const ProductModal = ({ mode, product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    deviceName: product?.deviceName || "Hayati Pro Max 6000",
    type: product?.type || "Flavour",
    price: product?.price || "",
    sizes: product?.sizes || [],
    images: product?.images || [],
  });

  const [newSize, setNewSize] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ...(product?.id && { id: product.id }),
    });
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize],
      });
      setNewSize("");
    }
  };

  const removeSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h2>{mode === "add" ? "Add New Product" : "Edit Product"}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

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
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Device *</label>
            <select
              value={formData.deviceName}
              onChange={(e) =>
                setFormData({ ...formData, deviceName: e.target.value })
              }
              required
            >
              <option value="Hayati Pro Max 6000">Hayati Pro Max 6000</option>
              <option value="Hayati Rubik 7000">Hayati Rubik 7000</option>
              <option value="Crystal Pro Switch 30K">
                Crystal Pro Switch 30K
              </option>
              <option value="Crystal Pro CP 10K">Crystal Pro CP 10K</option>
              <option value="Hayati mini 1500">Hayati mini 1500</option>
            </select>
          </div>

          <div className="form-group">
            <label>Type *</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            >
              <option value="Flavour">Flavour</option>
              <option value="Refiller">Refiller</option>
              <option value="Bundel">Bundle</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price *</label>
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
            <label>Sizes</label>
            <div className="size-input">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Add size (e.g., 10ml)"
              />
              <button type="button" onClick={addSize}>
                Add
              </button>
            </div>
            <div className="size-tags">
              {formData.sizes.map((size, index) => (
                <span key={index} className="size-tag">
                  {size}
                  <button type="button" onClick={() => removeSize(index)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Product Images</label>
            <div className="image-upload-section">
              <label className="upload-btn">
                <Upload size={16} /> Upload Images
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
              <div className="image-preview-grid">
                {formData.images.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={img} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={uploading}>
              {mode === "add" ? "Add Product" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;
