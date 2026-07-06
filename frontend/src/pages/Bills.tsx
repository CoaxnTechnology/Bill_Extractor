import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import BillTable from "@/components/BillTable"
import { getBills, deleteBill, exportCSV } from "@/api/bills"
import { toast } from "sonner"
import type { Bill } from "@/types"

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const fetchBills = useCallback(async (start_date?: string, end_date?: string) => {
    setLoading(true)
    try {
      const data = await getBills(start_date, end_date)
      setBills(data)
    } catch {
      toast.error("Failed to load bills.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBills(dateFrom || undefined, dateTo || undefined)
  }, [fetchBills, dateFrom, dateTo])

  const handleView = useCallback((bill: Bill) => {
    toast.info(`Viewing ${bill.invoice_number}`, {
      description: `Customer: ${bill.customer_name}`,
    })
  }, [])

  const handleDownload = useCallback((bill: Bill) => {
    toast.success(`Downloading ${bill.invoice_number}...`)
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteBill(id)
      toast.success("Bill deleted successfully.")
      setBills((prev) => prev.filter((b) => b.id !== id))
    } catch {
      toast.error("Failed to delete bill.")
    }
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground mt-1">
            View and manage extracted bills.
          </p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <BillTable
        bills={bills}
        loading={loading}
        onView={handleView}
        onDownload={handleDownload}
        onDelete={handleDelete}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onFromChange={setDateFrom}
        onToChange={setDateTo}
      />
    </div>
  )
}
