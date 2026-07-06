import axios from "axios"
import type { Bill, BillListResponse, MultiUploadResponse } from "@/types"

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.detail || err.message || "Something went wrong"
    return Promise.reject(new Error(message))
  },
)

export async function getBills(start_date?: string, end_date?: string): Promise<Bill[]> {
  const params: Record<string, string | number> = { page: 1, page_size: 100 }
  if (start_date) params.start_date = start_date
  if (end_date) params.end_date = end_date
  const { data } = await http.get<BillListResponse>("/bills", { params })
  return data.items
}

export async function uploadBill(file: File): Promise<Bill> {
  const form = new FormData()
  form.append("file", file)
  const { data } = await http.post<Bill>("/upload", form)
  return data
}

export async function uploadMultipleBills(files: File[]): Promise<MultiUploadResponse> {
  const form = new FormData()
  files.forEach((f) => form.append("files", f))
  const { data } = await http.post<MultiUploadResponse>("/upload/multiple", form)
  return data
}

export async function deleteBill(id: string): Promise<void> {
  await http.delete(`/bills/${id}`)
}

export async function exportCSV(): Promise<void> {
  const { data, headers } = await http.get("/export/csv", {
    responseType: "blob",
  })
  const disposition = headers["content-disposition"] ?? ""
  const match = disposition.match(/filename=(.+)/)
  const filename = match?.[1] ?? "bills.csv"
  const url = URL.createObjectURL(data)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
