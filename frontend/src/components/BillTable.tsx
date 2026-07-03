import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Eye,
  Download,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import DateFilter from "@/components/DateFilter"
import BillDetailsDialog from "@/components/BillDetailsDialog"
import EmptyState from "@/components/EmptyState"
import { BillTableSkeleton } from "@/components/Loading"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Bill } from "@/types"

const columnHelper = createColumnHelper<Bill>()

interface BillTableProps {
  bills: Bill[]
  loading: boolean
  onView: (bill: Bill) => void
  onDownload: (bill: Bill) => void
  onDelete: (id: string) => void
}

export default function BillTable({ bills, loading, onView, onDownload, onDelete }: BillTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [detailBill, setDetailBill] = useState<Bill | null>(null)

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (!dateFrom && !dateTo) return true
      const billDate = new Date(b.bill_date)
      if (dateFrom && billDate < new Date(dateFrom)) return false
      if (dateTo) {
        const end = new Date(dateTo)
        end.setHours(23, 59, 59, 999)
        if (billDate > end) return false
      }
      return true
    })
  }, [bills, dateFrom, dateTo])

  const columns = useMemo(
    () => [
      columnHelper.accessor("customer_name", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-medium"
            onClick={() => column.toggleSorting()}
          >
            Customer Name
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
      }),
      columnHelper.accessor("invoice_number", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-medium"
            onClick={() => column.toggleSorting()}
          >
            Invoice Number
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
      }),
      columnHelper.accessor("bill_date", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-medium"
            onClick={() => column.toggleSorting()}
          >
            Bill Date
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-medium"
            onClick={() => column.toggleSorting()}
          >
            Uploaded Date
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(row.original)}
              aria-label={`View ${row.original.invoice_number}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDownload(row.original)}
              aria-label={`Download ${row.original.invoice_number}`}
            >
              <Download className="h-4 w-4" />
            </Button>
            <AlertDialog
              open={deleteId === row.original.id}
              onOpenChange={(open) => { if (!open) setDeleteId(null) }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(row.original.id)}
                  aria-label={`Delete ${row.original.invoice_number}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete invoice{" "}
                    <strong>{row.original.invoice_number}</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(row.original.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      }),
    ],
    [onView, onDownload, onDelete, deleteId]
  )

  const table = useReactTable({
    data: filteredBills,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  if (loading) return <BillTableSkeleton />
  if (bills.length === 0) return <EmptyState />

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search bills..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 max-w-sm"
          aria-label="Search bills"
        />
        <DateFilter
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
          onReset={() => { setDateFrom(""); setDateTo("") }}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <BillDetailsDialog
        bill={detailBill}
        open={!!detailBill}
        onOpenChange={(open) => { if (!open) setDetailBill(null) }}
      />
    </div>
  )
}
