import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    type: "Lost",
    location: "",
    date: "",
    contactInfo: ""
  });

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  // 📦 FETCH ITEMS
  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/items", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ✍ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔍 HANDLE SEARCH
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/items/search?name=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ➕ ADD ITEM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/items",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Item Added Successfully");

      setForm({
        itemName: "",
        description: "",
        type: "Lost",
        location: "",
        date: "",
        contactInfo: ""
      });

      fetchItems();

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  // 🗑 DELETE ITEM
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Item Deleted");
      setItems(items.filter((item) => item._id !== id));

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  // ✏ UPDATE ITEM
  const handleUpdate = async (id) => {
    const newLocation = prompt("Enter new location:");

    if (!newLocation) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/items/${id}`,
        { location: newLocation },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Item Updated");
      fetchItems();

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      
      {/* HEADER */}
      <div className="d-flex justify-content-between">
        <h2>Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ADD ITEM FORM */}
      <h4 className="mt-3">Add Item</h4>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="itemName"
          placeholder="Item Name"
          value={form.itemName}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <select
          className="form-control mb-2"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>

        <input
          className="form-control mb-2"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="contactInfo"
          placeholder="Contact Info"
          value={form.contactInfo}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary">Add Item</button>
      </form>

      {/* SEARCH */}
      <h4 className="mt-4">Search Items</h4>

      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* ITEMS LIST */}
      <h4 className="mt-4">All Items</h4>

      <ul className="list-group">
        {items.map((item) => (
          <li key={item._id} className="list-group-item">
            <strong>{item.itemName}</strong> ({item.type}) <br />
            {item.description} <br />
            📍 {item.location} <br />
            📞 {item.contactInfo} <br />

            <button
              className="btn btn-warning btn-sm me-2 mt-2"
              onClick={() => handleUpdate(item._id)}
            >
              Update
            </button>

            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={() => handleDelete(item._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;