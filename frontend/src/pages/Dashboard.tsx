import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Calendar, ArrowRight } from "lucide-react"
import { getBills } from "@/api/bills"
import { StatsCardSkeleton } from "@/components/Loading"
import type { Bill } from "@/types"

export default function Dashboard() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBills()
      .then((data) => {
        setBills(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const today = new Date().toISOString().split("T").shift() ?? ""
  const uploadedToday = bills.filter((b) => b.created_at.startsWith(today)).length
  const recentUploads = [...bills]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your bills.</p>
        </div>
        <StatsCardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your bills.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uploaded Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{uploadedToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" size="sm">
              <Link to="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Bill
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="sm">
              <Link to="/bills">
                <FileText className="mr-2 h-4 w-4" />
                View All Bills
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Uploads</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/bills">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentUploads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No bills uploaded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentUploads.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{bill.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{bill.invoice_number}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {bill.bill_date}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
