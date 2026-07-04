import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react';

interface DataTableProps<T, TValue = unknown> {
  data: T[];
  columns: ColumnDef<T, TValue>[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T, TValue = unknown>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data available',
}: DataTableProps<T, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-slate-200 dark:border-slate-800">
              {headerGroup.headers.map((header) => {
                const sortable = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500
                      dark:text-slate-400"
                  >
                    {header.isPlaceholder ? null : sortable ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100
                          transition-colors"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : sortDirection === 'desc' ? (
                          <ArrowDown className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 dark:border-slate-800/60">
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-4">
                    <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  </td>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="h-8 w-8" />
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50
                  dark:border-slate-800/60 dark:hover:bg-slate-800/40"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
