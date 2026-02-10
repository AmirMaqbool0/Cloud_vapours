import React, { useState } from "react";
import "./style.css";
import { app } from "../../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { Upload, Plus, Loader } from "lucide-react";

const db = getFirestore(app);

const CLOUD_NAME = "dgas13tyw";
const UPLOAD_PRESET = "cloudVapours";

const AddBlog = () => {
  const [mainHeading, setMainHeading] = useState("");
  const [mainDetail, setMainDetail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [subSections, setSubSections] = useState([
    { subheading: "", detail: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubSectionChange = (index, field, value) => {
    const updated = [...subSections];
    updated[index][field] = value;
    setSubSections(updated);
  };

  const addSubSection = () => {
    setSubSections([...subSections, { subheading: "", detail: "" }]);
  };

  const removeSubSection = (index) => {
    if (subSections.length > 1) {
      setSubSections(subSections.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainHeading || !mainDetail || !imageFile) {
      return alert("Please fill all required fields");
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);

      await addDoc(collection(db, "blogs"), {
        heading: mainHeading,
        detail: mainDetail,
        image: imageUrl,
        subSections,
        createdAt: Timestamp.now(),
      });

      alert("Blog uploaded successfully!");
      // Reset form
      setMainHeading("");
      setMainDetail("");
      setImageFile(null);
      setImagePreview(null);
      setSubSections([{ subheading: "", detail: "" }]);
    } catch (error) {
      console.error("Error uploading blog:", error);
      alert("Error uploading blog: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-upload-container">
      <div className="blog-upload-card">
        <h1 className="blog-upload-title">Create New Blog Post</h1>

        <form onSubmit={handleSubmit} className="blog-upload-form">
          {/* Image Upload Section */}
          <div className="form-section">
            <label className="form-label">Featured Image *</label>
            <div className="image-upload-container">
              <label className="image-upload-box">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={24} />
                    <span>Click to upload image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="hidden-input"
                />
              </label>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="form-section">
            <label className="form-label">Title *</label>
            <input
              type="text"
              placeholder="Enter blog title"
              value={mainHeading}
              onChange={(e) => setMainHeading(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-section">
            <label className="form-label">Main Content *</label>
            <textarea
              placeholder="Write your main content here..."
              value={mainDetail}
              onChange={(e) => setMainDetail(e.target.value)}
              required
              className="form-textarea"
              rows={6}
            />
          </div>

          {/* Subsections */}
          <div className="form-section">
            <label className="form-label">Sections</label>
            {subSections.map((section, index) => (
              <div key={index} className="subsection-card">
                <input
                  type="text"
                  placeholder="Section heading"
                  value={section.subheading}
                  onChange={(e) =>
                    handleSubSectionChange(index, "subheading", e.target.value)
                  }
                  className="form-input"
                />
                <textarea
                  placeholder="Section content"
                  value={section.detail}
                  onChange={(e) =>
                    handleSubSectionChange(index, "detail", e.target.value)
                  }
                  className="form-textarea"
                  rows={4}
                />
                {subSections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubSection(index)}
                    className="remove-subsection-btn"
                  >
                    Remove Section
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubSection}
              className="add-subsection-btn"
            >
              <Plus size={16} /> Add Section
            </button>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <Loader size={18} className="spin" /> Publishing...
                </>
              ) : (
                "Publish Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddBlog;
