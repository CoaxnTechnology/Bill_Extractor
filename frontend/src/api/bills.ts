import type { Bill } from "@/types"

const MOCK_BILLS: Bill[] = [
  {
    id: "1",
    customer_name: "John Doe",
    invoice_number: "INV-1001",
    bill_date: "2026-06-16",
    created_at: "2026-06-17",
  },
  {
    id: "2",
    customer_name: "Alice Smith",
    invoice_number: "INV-1002",
    bill_date: "2026-06-20",
    created_at: "2026-06-21",
  },
  {
    id: "3",
    customer_name: "Bob Johnson",
    invoice_number: "INV-1003",
    bill_date: "2026-06-22",
    created_at: "2026-06-23",
  },
  {
    id: "4",
    customer_name: "Jane Wilson",
    invoice_number: "INV-1004",
    bill_date: "2026-06-25",
    created_at: "2026-06-26",
  },
  {
    id: "5",
    customer_name: "Charlie Brown",
    invoice_number: "INV-1005",
    bill_date: "2026-06-28",
    created_at: "2026-06-29",
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getBills(): Promise<Bill[]> {
  await delay(500)
  return [...MOCK_BILLS]
}

export async function uploadBill(_file: File): Promise<Bill> {
  await delay(1500)
  const newBill: Bill = {
    id: String(Date.now()),
    customer_name: "New Customer",
    invoice_number: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
    bill_date: new Date().toISOString().split("T")[0] ?? "",
    created_at: new Date().toISOString().split("T")[0] ?? "",
  }
  return newBill
}

export async function deleteBill(id: string): Promise<void> {
  await delay(300)
  const index = MOCK_BILLS.findIndex((b) => b.id === id)
  if (index !== -1) {
    MOCK_BILLS.splice(index, 1)
  }
}

export async function exportCSV(): Promise<void> {
  await delay(500)
  const csv = [
    "Customer Name,Invoice Number,Bill Date,Uploaded Date",
    ...MOCK_BILLS.map(
      (b) => `${b.customer_name},${b.invoice_number},${b.bill_date},${b.created_at}`
    ),
  ].join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "bills.csv"
  a.click()
  URL.revokeObjectURL(url)
}
