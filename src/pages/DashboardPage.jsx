
import React, { useState, useEffect } from 'react';
import { getStores, getRatings, addRating } from '../services/dataService';
import { getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';
import { jwtDecode } from 'jwt-decode';

import Loading from '../components/Loading';
import StoreList from '../components/StoreList';

function DashboardPage() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const decodedToken = jwtDecode(user.accessToken);
      setUser(decodedToken);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const storesData = await getStores();
      const ratingsData = await getRatings();
      setStores(storesData);
      setRatings(ratingsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
    setLoading(false);
  };

  const handleAddRating = async (storeId, rating) => {
    await addRating({ storeId, userId: user.id, rating });
    fetchData();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard, {user?.name}.</p>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <p>{ratings.filter(r => r.userId === user.id).length}</p>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder={"Search by store name or address"}
        />
      </div>

      <StoreList stores={stores} ratings={ratings} user={user} fetchData={fetchData} filtering={filtering} />
    </div>
  );
}

export default DashboardPage;