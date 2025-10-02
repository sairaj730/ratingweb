
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getStats, getStores } from '../services/dataService';
import { register } from '../services/authService';
import { getUsers } from '../services/userService';
import '../styles/Dashboard.css';
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import Loading from '../components/Loading';

function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFiltering, setUserFiltering] = useState('');
  const [storeFiltering, setStoreFiltering] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const statsData = await getStats();
      const usersData = await getUsers();
      const storesData = await getStores();
      setStats(statsData.data);
      setUsers(usersData.data);
      setStores(storesData.data);
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
    await register(newUser);
    fetchData();
    setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal User' });
  };

  const userColumns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Address', accessorKey: 'address' },
      { header: 'Role', accessorKey: 'role' },
      {
        header: 'Rating',
        accessorKey: 'rating',
        cell: ({ row }) => (
          row.original.role === 'Store Owner' ? row.original.rating : 'N/A'
        ),
      },
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

  const userTable = useReactTable({ columns: userColumns, data: users, state: { sorting, globalFilter: userFiltering }, onSortingChange: setSorting, onGlobalFilterChange: setUserFiltering, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(), getFilteredRowModel: getFilteredRowModel() });
  const storeTable = useReactTable({ columns: storeColumns, data: stores, state: { sorting, globalFilter: storeFiltering }, onSortingChange: setSorting, onGlobalFilterChange: setStoreFiltering, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(), getFilteredRowModel: getFilteredRowModel() });

  if (loading) {
    return <Loading />;
  }

  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });

  const handleNewStoreChange = (e) => {
    const { name, value } = e.target;
    setNewStore({ ...newStore, [name]: value });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    await addStore(newStore);
    fetchData();
    setNewStore({ name: '', email: '', address: '', owner_id: '' });
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card">Total Users: {stats.users}</div>
        <div className="stat-card">Total Stores: {stats.stores}</div>
        <div className="stat-card">Total Ratings: {stats.ratings}</div>
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
            <option value="System Administrator">System Administrator</option>
            <option value="Store Owner">Store Owner</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>

      <div className="add-store-form">
        <h2>Add New Store</h2>
        <form onSubmit={handleAddStore}>
          <input type="text" name="name" placeholder="Name" value={newStore.name} onChange={handleNewStoreChange} required />
          <input type="email" name="email" placeholder="Email" value={newStore.email} onChange={handleNewStoreChange} required />
          <input type="text" name="address" placeholder="Address" value={newStore.address} onChange={handleNewStoreChange} required />
          <input type="number" name="owner_id" placeholder="Owner ID" value={newStore.owner_id} onChange={handleNewStoreChange} required />
          <button type="submit">Add Store</button>
        </form>
      </div>

      <div className="user-list">
        <h2>Users</h2>
        <input
          type="text"
          value={userFiltering}
          onChange={(e) => setUserFiltering(e.target.value)}
          placeholder={"Search users..."}
        />
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
        <input
          type="text"
          value={storeFiltering}
          onChange={(e) => setStoreFiltering(e.target.value)}
          placeholder={"Search stores..."}
        />
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