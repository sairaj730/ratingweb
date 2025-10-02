
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getStores, getRatings } from '../services/dataService';
import { getUsers } from '../services/userService';
import { getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { jwtDecode } from 'jwt-decode';

function StoreOwnerDashboardPage() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const decodedToken = jwtDecode(currentUser.accessToken);
      setUser(decodedToken);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const storesData = await getStores();
    const ratingsData = await getRatings();
    const usersData = await getUsers();
    const ownerStore = storesData.find(s => s.email === user.email);
    if (ownerStore) {
      setStore(ownerStore);
      const storeRatings = ratingsData.filter(r => r.storeId === ownerStore.id);
      setRatings(storeRatings);
      setUsers(usersData);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(
    () => [
      {
        header: 'User Name',
        accessorKey: 'userName',
        cell: ({ row }) => {
          const ratingUser = users.find(u => u.id === row.original.userId);
          return ratingUser ? ratingUser.name : 'Unknown User';
        },
      },
      { header: 'Rating', accessorKey: 'rating' },
    ],
    [users]
  );

  const table = useReactTable({
    columns,
    data: ratings,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="dashboard-container">
      <h1>Store Owner Dashboard</h1>
      {store ? (
        <div>
          <h2>{store.name}</h2>
          <p><strong>Email:</strong> {store.email}</p>
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>Average Rating:</strong> {ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1) : 'N/A'}</p>

          <div className="rating-list">
            <h3>All Ratings</h3>
            <table>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {
                          { asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() ?? null]
                        }
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>You do not own a store.</p>
      )}
    </div>
  );
}

export default StoreOwnerDashboardPage;
