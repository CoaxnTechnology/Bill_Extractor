export interface Bill {
  id: string
  customer_name: string | null
  invoice_number: string | null
  bill_date: string | null
  pdf_path: string
  created_at: string
}

export interface BillListResponse {
  items: Bill[]
  total: number
  page: number
  page_size: number
}

export interface BillFormData {
  file: FileList
}

export interface UploadResult {
  filename: string
  status: "success" | "failed"
  bill?: Bill
  error?: string
}

export interface MultiUploadResponse {
  total: number
  success: number
  failed: number
  results: UploadResult[]
}
