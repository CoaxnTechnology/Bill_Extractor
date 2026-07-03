import { Inbox } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
}

export default function EmptyState({
  title = "No bills found",
  description = "Upload your first bill to get started.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <Inbox className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
