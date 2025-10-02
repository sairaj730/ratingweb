
import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';

function StoreList({ stores, ratings, user, handleAddRating, filtering }) {
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Address', accessorKey: 'address' },
      {
        header: 'Average Rating',
        accessorKey: 'avgRating',
        cell: ({ row }) => {
          const storeRatings = ratings.filter(r => r.storeId === row.original.id);
          return storeRatings.length > 0 ? (storeRatings.reduce((acc, r) => acc + r.rating, 0) / storeRatings.length).toFixed(1) : 'N/A';
        },
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
            onChange={(e) => handleAddRating(row.original.id, parseInt(e.target.value))}
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
    [ratings, user.id, handleAddRating]
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
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </button>{' '}
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>{' '}
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>{' '}
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
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
  );
}

export default StoreList;
