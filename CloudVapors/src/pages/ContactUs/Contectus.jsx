import React, { useState } from "react";
import "./style.css";
import { Phone, Mail, MapPin } from "lucide-react";
import Heading from "../../component/Heading/Heading";
import { app } from '../../firebase';
import { getFirestore, collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { ClockLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

const Contectus = () => {
  const db = getFirestore(app);

  // State values
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    subject: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form field handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone) newErrors.phone = 'Phone is required';
    if (!form.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  // Submit function
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const ref = collection(db, 'messages');
      const docRef = await addDoc(ref, form);
      await updateDoc(doc(db, 'messages', docRef.id), { uid: docRef.id });

      toast.success("Message sent successfully!");

      // Reset form
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        subject: '',
      });
      setErrors({});
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Failed to send message.");
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Heading  text={'Contact us'} head={'Get in Touch'} info={'Got questions? Ready to order? We’re here to help.'} />

      <div className="contect-us-main-container-page">
        <div className="contect-us-main-box">
          <div className="contect-us-left-box">
            <div className="contect-us-text">
              <span>Contact Information</span>
              <p>Say something to start a live chat!</p>
            </div>
            <div className="contect-info">
              <div className="contect-us-phone">
                <Phone color="white" size={20} /> <span>+1012 3456 789</span>
              </div>
              <div className="contect-us-phone">
                <Mail color="white" size={20} /><span>demo@gmail.com</span>
              </div>
              <div className="contect-us-phone">
                <MapPin color="white" size={38} />
                <span>132 Dartmouth Street Boston, MA 02156</span>
              </div>
            </div>
          </div>

          <div className="contect-us-right-box">
            <div className="conctect-us-input-main">
              <div className="contect-us-input-first">
                <span>First Name</span>
                <input name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} />
                {errors.firstName && <p className="error">{errors.firstName}</p>}
              </div>
              <div className="contect-us-input-first">
                <span>Last Name</span>
                <input name="lastName" type="text" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="conctect-us-input-main">
              <div className="contect-us-input-first">
                <span>Email</span>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="contect-us-input-first">
                <span>Phone Number</span>
                <input name="phone" type="text" placeholder="Phone" value={form.phone} onChange={handleChange} />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>
            </div>

            <div className="check-box-contect">
              <div className="check-box-heading">
                <span>Select Subject?</span>
              </div>
              <div className="check-box-inputs">
                {["General Inquiry", "Support", "Feedback"].map((item, i) => (
                  <div className="checkbox" key={i}>
                    <input
                      type="radio"
                      name="subject"
                      value={item}
                      checked={form.subject === item}
                      onChange={handleChange}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="contect-us-massage">
              <span>Message</span>
              <input name="message" type="text" placeholder="Message" value={form.message} onChange={handleChange} />
              {errors.message && <p className="error">{errors.message}</p>}
            </div>

            <div className="contect-us-page-submit-button">
              <button onClick={handleSubmit}>
                {loading ? <ClockLoader size={20} color="white" /> : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contectus;