import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getUsers, getStores, getRatings, addUser } from '../services/dataService';
import '../styles/Dashboard.css';
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import Loading from '../components/Loading';

function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const usersData = await getUsers();
      const storesData = await getStores();
      const ratingsData = await getRatings();
      setUsers(usersData);
      setStores(storesData);
      setRatings(ratingsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    await addUser(newUser);
    fetchData();
    setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal User' });
  };

  const userColumns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Address', accessorKey: 'address' },
      { header: 'Role', accessorKey: 'role' },
      { header: 'Rating', accessorKey: 'rating', cell: ({ row }) => (row.original.role === 'Store Owner' ? row.original.rating : 'N/A') },
    ],
    []
  );

  const storeColumns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Address', accessorKey: 'address' },
      { header: 'Rating', accessorKey: 'rating' },
    ],
    []
  );

  const userTable = useReactTable({ columns: userColumns, data: users, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });
  const storeTable = useReactTable({ columns: storeColumns, data: stores, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card">Total Users: {users.length}</div>
        <div className="stat-card">Total Stores: {stores.length}</div>
        <div className="stat-card">Total Ratings: {ratings.length}</div>
      </div>

      <div className="add-user-form">
        <h2>Add New User</h2>
        <form onSubmit={handleAddUser}>
          <input type="text" name="name" placeholder="Name" value={newUser.name} onChange={handleNewUserChange} required />
          <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleNewUserChange} required />
          <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleNewUserChange} required />
          <input type="text" name="address" placeholder="Address" value={newUser.address} onChange={handleNewUserChange} required />
          <select name="role" value={newUser.role} onChange={handleNewUserChange}>
            <option value="Normal User">Normal User</option>
            <option value="Admin User">Admin User</option>
            <option value="Store Owner">Store Owner</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>

      <div className="user-list">
        <h2>Users</h2>
        <table>
          <thead>
            {userTable.getHeaderGroups().map(headerGroup => (
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
            {userTable.getRowModel().rows.map(row => (
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
        <div className="pagination">
          <button onClick={() => userTable.setPageIndex(0)} disabled={!userTable.getCanPreviousPage()}>
            {'<<'}
          </button>{' '}
          <button onClick={() => userTable.previousPage()} disabled={!userTable.getCanPreviousPage()}>
            {'<'}
          </button>{' '}
          <button onClick={() => userTable.nextPage()} disabled={!userTable.getCanNextPage()}>
            {'>'}
          </button>{' '}
          <button onClick={() => userTable.setPageIndex(userTable.getPageCount() - 1)} disabled={!userTable.getCanNextPage()}>
            {'>>'}
          </button>
          <span>
            Page{' '}
            <strong>
              {userTable.getState().pagination.pageIndex + 1} of {userTable.getPageCount()}
            </strong>
          </span>
          <span>
            | Go to page:
            <input
              type="number"
              defaultValue={userTable.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                userTable.setPageIndex(page);
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={userTable.getState().pagination.pageSize}
            onChange={e => {
              userTable.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="store-list">
        <h2>Stores</h2>
        <table>
          <thead>
            {storeTable.getHeaderGroups().map(headerGroup => (
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
            {storeTable.getRowModel().rows.map(row => (
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
        <div className="pagination">
          <button onClick={() => storeTable.setPageIndex(0)} disabled={!storeTable.getCanPreviousPage()}>
            {'<<'}
          </button>{' '}
          <button onClick={() => storeTable.previousPage()} disabled={!storeTable.getCanPreviousPage()}>
            {'<'}
          </button>{' '}
          <button onClick={() => storeTable.nextPage()} disabled={!storeTable.getCanNextPage()}>
            {'>'}
          </button>{' '}
          <button onClick={() => storeTable.setPageIndex(storeTable.getPageCount() - 1)} disabled={!storeTable.getCanNextPage()}>
            {'>>'}
          </button>
          <span>
            Page{' '}
            <strong>
              {storeTable.getState().pagination.pageIndex + 1} of {storeTable.getPageCount()}
            </strong>
          </span>
          <span>
            | Go to page:
            <input
              type="number"
              defaultValue={storeTable.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                storeTable.setPageIndex(page);
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={storeTable.getState().pagination.pageSize}
            onChange={e => {
              storeTable.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;