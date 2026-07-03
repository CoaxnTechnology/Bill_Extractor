import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface DateFilterProps {
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  onReset: () => void
}

export default function DateFilter({ from, to, onFromChange, onToChange, onReset }: DateFilterProps) {
  const hasFilter = from || to

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label htmlFor="from-date" className="text-xs">From</Label>
        <Input
          id="from-date"
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="h-9 w-40"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="to-date" className="text-xs">To</Label>
        <Input
          id="to-date"
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="h-9 w-40"
        />
      </div>
      {hasFilter && (
        <Button variant="ghost" size="icon" onClick={onReset} aria-label="Reset date filter">
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
