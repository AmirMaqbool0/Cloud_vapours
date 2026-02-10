import React, { useEffect, useState } from "react";
import "./style.css";
import Header from "../../components/Header/Header";
import { Search, ChevronDown, X, Check, Truck, Clock } from "lucide-react";
import { app } from "../../firebase";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import { format } from "date-fns";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const db = getFirestore(app);

  const Get_Orders = async () => {
    const collectionRef = collection(db, "orders");
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(), 
    }));
    setOrders(arr);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      Get_Orders(); 
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    Get_Orders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !selectedDate ||
      (order.createdAt &&
        format(order.createdAt, "yyyy-MM-dd") === selectedDate);

    return matchesSearch && matchesDate;
  });

  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(date, "MMM dd, yyyy hh:mm a");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Check className="icon approved" />;
      case "rejected":
        return <X className="icon rejected" />;
      case "shipped":
        return <Truck className="icon shipped" />;
      default:
        return <Clock className="icon pending" />;
    }
  };

  return (
    <div className="orders-container">
      <Header />
      <div className="orders-content">
        <div className="orders-header">
          <div className="orders-search">
            {/* <Search className="search-icon" /> */}
            <input
              type="text"
              placeholder="Search by Order ID or User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="date-filter">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id.substring(0, 8)}...</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.address?.title || "N/A"}</td>
                  <td>
                    {order.products?.length > 0 ? (
                      <div className="product-info">
                        {order.products[0].name} × {order.products[0].quantity}
                        {order.products.length > 1 &&
                          ` +${order.products.length - 1} more`}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>${order.totals?.total?.toFixed(2) || "0.00"}</td>
                  <td>
                    <div className={`status-badge ${order.status}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailOpen(true);
                        }}
                      >
                        View
                      </button>
                      <div className="status-dropdown">
                        <button className="status-toggle">
                          <ChevronDown size={16} />
                        </button>
                        <div className="status-menu">
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "shipped")
                            }
                          >
                            Mark as Shipped
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="no-orders">
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {isDetailOpen && selectedOrder && (
        <div className="order-detail-modal">
          <div
            className="modal-overlay"
            onClick={() => setIsDetailOpen(false)}
          ></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order Details</h3>
              <button onClick={() => setIsDetailOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Order Information</h4>
                <div className="detail-row">
                  <span>Order ID:</span>
                  <span>{selectedOrder.id}</span>
                </div>
                <div className="detail-row">
                  <span>Date:</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span className={`status-badge ${selectedOrder.status}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Payment Status:</span>
                  <span>{selectedOrder.paymentStatus}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Customer Information</h4>
                <div className="detail-row">
                  <span>User ID:</span>
                  <span>{selectedOrder.userId}</span>
                </div>
                <div className="detail-row">
                  <span>Address:</span>
                  <span>{selectedOrder.address?.address || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <span>{selectedOrder.address?.phone || "N/A"}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Shipping Information</h4>
                <div className="detail-row">
                  <span>Method:</span>
                  <span>{selectedOrder.shipping?.method || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <span>Estimated Delivery:</span>
                  <span>{selectedOrder.shipping?.date || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <span>Shipping Cost:</span>
                  <span>
                    ${selectedOrder.shipping?.cost?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Products</h4>
                <div className="products-list">
                  {selectedOrder.products?.map((product, index) => (
                    <div key={index} className="product-item">
                      <img src={product.image} alt={product.name} />
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-details">
                          <span>Flavor: {product.flavor}</span>
                          <span>Nicotine: {product.nicotineStrength}</span>
                          <span>Puffs: {product.puffCount}</span>
                        </div>
                      </div>
                      <div className="product-price">
                        <div>
                          ${product.price.toFixed(2)} × {product.quantity}
                        </div>
                        <div className="total">
                          ${(product.price * product.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section totals-section">
                <div className="detail-row">
                  <span>Subtotal:</span>
                  <span>
                    ${selectedOrder.totals?.subtotal?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Tax:</span>
                  <span>
                    ${selectedOrder.totals?.tax?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="detail-row total">
                  <span>Total:</span>
                  <span>
                    ${selectedOrder.totals?.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-close"
                onClick={() => setIsDetailOpen(false)}
              >
                Close
              </button>
              <div className="status-actions">
                <button
                  className={`btn-action ${
                    selectedOrder.status === "approved" ? "active" : ""
                  }`}
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, "approved");
                    setIsDetailOpen(false);
                  }}
                >
                  Approve
                </button>
                <button
                  className={`btn-action ${
                    selectedOrder.status === "rejected" ? "active" : ""
                  }`}
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, "rejected");
                    setIsDetailOpen(false);
                  }}
                >
                  Reject
                </button>
                <button
                  className={`btn-action ${
                    selectedOrder.status === "shipped" ? "active" : ""
                  }`}
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, "shipped");
                    setIsDetailOpen(false);
                  }}
                >
                  Ship
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
