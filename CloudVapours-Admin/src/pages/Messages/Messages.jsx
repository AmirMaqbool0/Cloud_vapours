import React, { useEffect, useState } from "react";
import "./style.css";
import Header from "../../components/Header/Header";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { app } from "../../firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { format } from "date-fns";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const db = getFirestore(app);

  const Get_Messages = async () => {
    const collectionRef = collection(db, "messages");
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
    setMessages(arr);
    setFilteredMessages(arr);
  };

  const filterMessages = () => {
    let filtered = [...messages];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((msg) => {
        if (!msg.createdAt) return false;

        const msgDate = new Date(msg.createdAt);
        msgDate.setHours(0, 0, 0, 0);

        switch (dateFilter) {
          case "today":
            return msgDate.getTime() === today.getTime();
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return msgDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return msgDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = a.createdAt || new Date(0);
      const dateB = b.createdAt || new Date(0);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredMessages(filtered);
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  useEffect(() => {
    Get_Messages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, dateFilter, sortOrder]);

  return (
    <div className="messages-container">
      <Header />
      <div className="messages-content">
        <div className="messages-header">
          <div className="search-filter-container">
            <div className="search-box">
              <Search size={20} color="black" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-controls">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <button
                className="sort-button"
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
              >
                Date{" "}
                {sortOrder === "desc" ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="messages-table-container">
          <table className="messages-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className="message-row"
                  >
                    <td>
                      {message.firstName} {message.lastName}
                    </td>
                    <td>{message.email}</td>
                    <td>{message.subject}</td>
                    <td>
                      {message.createdAt
                        ? format(message.createdAt, "MMM d, yyyy h:mm a")
                        : "N/A"}
                    </td>
                    <td className="message-preview">
                      {message.message?.length > 50
                        ? `${message.message.substring(0, 50)}...`
                        : message.message}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-messages">
                    {searchTerm
                      ? "No matching messages found"
                      : "No messages available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedMessage && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <div className="modal-header">
              <h3>Message Details</h3>
              <button className="close-button" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <div className="message-detail">
                <label>From:</label>
                <p>
                  {selectedMessage.firstName} {selectedMessage.lastName}
                </p>
              </div>
              <div className="message-detail">
                <label>Email:</label>
                <p>{selectedMessage.email}</p>
              </div>
              <div className="message-detail">
                <label>Phone:</label>
                <p>{selectedMessage.phone || "Not provided"}</p>
              </div>
              <div className="message-detail">
                <label>Subject:</label>
                <p>{selectedMessage.subject}</p>
              </div>
              <div className="message-detail">
                <label>Date:</label>
                <p>
                  {selectedMessage.createdAt
                    ? format(selectedMessage.createdAt, "MMMM d, yyyy h:mm a")
                    : "N/A"}
                </p>
              </div>
              <div className="message-detail full-width">
                <label>Message:</label>
                <div className="message-text">{selectedMessage.message}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
