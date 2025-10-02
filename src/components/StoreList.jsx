import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import './StoreList.css';

function StoreList({ stores, ratings, user, fetchData, filtering }) {
  const [sorting, setSorting] = useState([]);

  const handleRatingChange = async (storeId, rating) => {
    const existingRating = ratings.find(r => r.storeId === storeId && r.userId === user.id);
    if (existingRating) {
      await updateRating({ storeId, rating });
    } else {
      await addRating({ storeId, rating });
    }
    fetchData();
  };

  const columns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Address', accessorKey: 'address' },
      {
        header: 'Average Rating',
        accessorKey: 'rating',
        cell: ({ row }) => (row.original.rating ? parseFloat(row.original.rating).toFixed(1) : 'N/A'),
      },
      {
        header: 'Your Rating',
        accessorKey: 'userRating',
        cell: ({ row }) => {
          const userRating = ratings.find(r => r.storeId === row.original.id && r.userId === user.id);
          return userRating ? userRating.rating : 'Not Rated';
        },
      },
      {
        header: 'Submit/Modify Rating',
        id: 'ratingAction',
        cell: ({ row }) => (
          <select
            value={ratings.find(r => r.storeId === row.original.id && r.userId === user.id)?.rating || ''}
            onChange={(e) => handleRatingChange(row.original.id, parseInt(e.target.value))}
          >
            <option value="">Rate</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        ),
      },
    ],
    [ratings, user.id, handleRatingChange]
  );

  const table = useReactTable({
    columns,
    data: stores,
    state: { sorting, globalFilter: filtering },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="store-list">
      <h2>Stores</h2>
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
      <div className="pagination">
        <div className="pagination-controls">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            {'<<'}
          </button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            {'<'}
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {'>'}
          </button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            {'>>'}
          </button>
        </div>
        <span className="page-info">
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <div className="page-actions">
          <span>
            Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
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

export default StoreList;
