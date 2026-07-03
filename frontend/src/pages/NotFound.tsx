import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-full bg-muted p-6">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Page not found.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
