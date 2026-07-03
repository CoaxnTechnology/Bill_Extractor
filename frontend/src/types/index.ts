export interface Bill {
  id: string
  customer_name: string
  invoice_number: string
  bill_date: string
  created_at: string
}

export interface BillFormData {
  file: FileList
}
