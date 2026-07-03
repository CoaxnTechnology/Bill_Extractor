import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Bill } from "@/types"

interface BillDetailsDialogProps {
  bill: Bill | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BillDetailsDialog({ bill, open, onOpenChange }: BillDetailsDialogProps) {
  if (!bill) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bill Details</DialogTitle>
          <DialogDescription>
            Detailed information about this bill.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
              <p className="text-sm font-semibold">{bill.customer_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
              <Badge variant="secondary" className="mt-1">{bill.invoice_number}</Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bill Date</p>
              <p className="text-sm">{bill.bill_date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Uploaded Date</p>
              <p className="text-sm">{bill.created_at}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
