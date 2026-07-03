import { useCallback, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getBills, uploadMultipleBills } from "@/api/bills"
import { toast } from "sonner"
import type { Bill, UploadResult } from "@/types"

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]

function nameFromFilename(name: string): string {
  return name
    .replace(/\.\w+$/, "")
    .replace(/[_-]/g, " ")
    .trim()
    .toLowerCase()
}

function isDuplicate(file: File, existingBills: Bill[]): boolean {
  const slug = nameFromFilename(file.name)
  return existingBills.some((b) => {
    if (!b.customer_name) return false
    const cust = b.customer_name.toLowerCase().replace(/\n.*/, "").trim()
    return cust === slug || cust.includes(slug) || slug.includes(cust)
  })
}

export default function UploadCard() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<UploadResult[] | null>(null)
  const [dragging, setDragging] = useState(false)

  const reset = useCallback(() => {
    setFiles([])
    setResults(null)
  }, [])

  const addFiles = useCallback(async (incoming: FileList | File[]) => {
    let existing: Bill[] = []
    try {
      existing = await getBills()
    } catch { /* ignore */ }

    const valid: File[] = []
    for (const f of incoming) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        toast.error(`"${f.name}" has an unsupported file type.`)
        continue
      }
      if (isDuplicate(f, existing)) {
        toast.warning(`"${f.name}" appears to be a duplicate — skipped.`)
        continue
      }
      valid.push(f)
    }
    setFiles((prev) => [...prev, ...valid])
    setResults(null)
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setResults(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
    },
    [addFiles]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) addFiles(e.target.files)
      e.target.value = ""
    },
    [addFiles]
  )

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return
    setUploading(true)
    setResults(null)

    try {
      const res = await uploadMultipleBills(files)
      setResults(res.results)
      setFiles((prev) => prev.filter((_, i) => res.results[i]?.status === "success"))
      if (res.failed === 0) {
        toast.success(`${res.success} bill(s) uploaded successfully!`)
        setTimeout(() => navigate("/bills"), 1500)
      } else if (res.success > 0) {
        toast.warning(`${res.success} uploaded, ${res.failed} failed.`)
      } else {
        toast.error("All uploads failed.")
      }
    } catch {
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }, [files, navigate])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload area"
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !uploading) {
              inputRef.current?.click()
            }
          }}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            className="hidden"
            onChange={handleChange}
            aria-hidden="true"
          />
          {files.length === 0 ? (
            <>
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium">Drag & drop or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF, PNG, or JPG (max. 20MB each)
              </p>
            </>
          ) : (
            <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{files.length} file(s) selected</p>
                {!uploading && !results && (
                  <Button variant="ghost" size="sm" onClick={reset}>
                    Clear all
                  </Button>
                )}
              </div>

              <div className="max-h-60 space-y-2 overflow-y-auto">
                {files.map((f, i) => {
                  const r = results?.[i]
                  return (
                    <div key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="rounded-lg bg-muted p-2">
                        <File className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {f.size < 1024 * 1024
                            ? `${(f.size / 1024).toFixed(1)} KB`
                            : `${(f.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                      {r ? (
                        r.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        ) : (
                          <div className="group relative shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="absolute bottom-full right-0 mb-1 hidden whitespace-nowrap rounded bg-red-500 px-2 py-1 text-xs text-white group-hover:block">
                              {r.error?.includes("already exists")
                                ? "Duplicate invoice - already in system"
                                : r.error}
                            </span>
                          </div>
                        )
                      ) : (
                        !uploading && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(i)}
                            aria-label={`Remove ${f.name}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  )
                })}
              </div>

              {uploading && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Uploading...
                </div>
              )}

              {!uploading && !results && files.length > 0 && (
                <Button className="w-full" size="lg" onClick={handleUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {files.length} Bill(s)
                </Button>
              )}

              {results && (
                <div className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">
                    {results.filter((r) => r.status === "success").length} succeeded,{" "}
                    {results.filter((r) => r.status === "failed").length} failed
                  </p>
                  {results.some((r) => r.error?.includes("already exists")) && (
                    <p className="text-xs text-amber-600 mt-1">
                      Some invoices already exist in the system — duplicates were skipped.
                    </p>
                  )}
                  {results.every((r) => r.status === "success") && (
                    <p className="text-xs text-muted-foreground mt-1">Redirecting to bills...</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
