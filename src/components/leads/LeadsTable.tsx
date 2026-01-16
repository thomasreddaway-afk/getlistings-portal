'use client';

import { useState, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Filter,
  Download,
  Plus,
  Search,
  Check,
} from 'lucide-react';
import { Lead } from '@/types';
import { cn } from '@/lib/utils/cn';
import { formatPhoneDisplay } from '@/lib/utils/phone';
import { format } from 'date-fns';
import Link from 'next/link';

interface LeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
  onLeadClick?: (lead: Lead) => void;
  onBulkAction?: (action: string, leadIds: string[]) => void;
}

const columnHelper = createColumnHelper<Lead>();

export function LeadsTable({ leads, isLoading, onLeadClick, onBulkAction }: LeadsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(() => [
    // Checkbox column
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    }),

    // Name column
    columnHelper.accessor((row) => `${row.first_name} ${row.last_name}`, {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600">
              {row.original.first_name?.[0]}{row.original.last_name?.[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900">
              {row.original.first_name} {row.original.last_name}
            </p>
            {row.original.is_exclusive && (
              <span className="text-xs text-amber-600">⭐ Exclusive</span>
            )}
          </div>
        </div>
      ),
    }),

    // Phone column
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1 text-slate-600">
          <Phone className="w-3 h-3" />
          <span className="text-sm">{formatPhoneDisplay(getValue() || '')}</span>
        </div>
      ),
    }),

    // Address column
    columnHelper.accessor('property_address', {
      header: 'Address',
      cell: ({ getValue }) => {
        const address = getValue();
        if (!address) return <span className="text-slate-400">—</span>;
        return (
          <div className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="text-sm truncate max-w-[200px]">{address}</span>
          </div>
        );
      },
    }),

    // Score column
    columnHelper.accessor('seller_score', {
      header: 'Score',
      cell: ({ getValue }) => {
        const score = getValue();
        if (!score) return <span className="text-slate-400">—</span>;
        return (
          <span className={cn(
            'score-badge',
            score >= 80 ? 'score-hot' : 
            score >= 60 ? 'score-warm' : 
            score >= 40 ? 'score-cool' : 'score-cold'
          )}>
            {score}%
          </span>
        );
      },
    }),

    // Follow-ups column
    columnHelper.accessor('follow_up_count', {
      header: 'Follow-ups',
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600">{getValue() || 0}</span>
      ),
    }),

    // Appraisal column
    columnHelper.accessor('appraisal_sent', {
      header: 'Appraisal',
      cell: ({ getValue }) => (
        getValue() ? (
          <span className="inline-flex items-center gap-1 text-green-600 text-sm">
            <Check className="w-3 h-3" /> Sent
          </span>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        )
      ),
    }),

    // Stage column
    columnHelper.accessor('current_stage_name', {
      header: 'Stage',
      cell: ({ getValue }) => {
        const stage = getValue();
        if (!stage) return <span className="text-slate-400">—</span>;
        return (
          <span className="stage-badge bg-slate-100 text-slate-700">
            {stage}
          </span>
        );
      },
    }),

    // Date column
    columnHelper.accessor('created_at', {
      header: 'Date',
      cell: ({ getValue }) => {
        const date = getValue();
        if (!date) return <span className="text-slate-400">—</span>;
        return (
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <Calendar className="w-3 h-3" />
            {format(date.toDate(), 'dd MMM yyyy')}
          </div>
        );
      },
    }),

    // Actions column
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <button 
          className="p-1 hover:bg-slate-100 rounded"
          onClick={(e) => {
            e.stopPropagation();
            // Open action menu
          }}
        >
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </button>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: leads,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-64 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Filters */}
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm text-slate-600">{selectedCount} selected</span>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onBulkAction?.('assign', Object.keys(rowSelection))}
              >
                Assign
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onBulkAction?.('move_stage', Object.keys(rowSelection))}
              >
                Move Stage
              </button>
            </div>
          )}
          
          <button className="btn btn-secondary btn-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <Link href="/leads/new" className="btn btn-primary btn-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id}
                    className={cn(
                      header.column.getCanSort() && 'cursor-pointer select-none hover:bg-slate-100'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        header.column.getIsSorted() === 'asc' 
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j}>
                      <div className="skeleton h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Users className="w-full h-full" />
                    </div>
                    <p className="empty-state-title">No leads found</p>
                    <p className="empty-state-description">
                      {globalFilter 
                        ? 'Try adjusting your search or filters'
                        : 'Add your first lead to get started'}
                    </p>
                    {!globalFilter && (
                      <Link href="/leads/new" className="btn btn-primary btn-md mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Lead
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id}
                  className={cn(
                    'cursor-pointer',
                    row.getIsSelected() && 'selected'
                  )}
                  onClick={() => onLeadClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            leads.length
          )}{' '}
          of {leads.length} leads
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: table.getPageCount() }).slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => table.setPageIndex(i)}
              className={cn(
                'btn btn-sm min-w-[36px]',
                table.getState().pagination.pageIndex === i
                  ? 'btn-primary'
                  : 'btn-secondary'
              )}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="btn btn-secondary btn-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Need to import Users for empty state
import { Users } from 'lucide-react';
