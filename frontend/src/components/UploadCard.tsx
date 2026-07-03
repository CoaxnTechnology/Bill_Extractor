import { useCallback, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, File, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { uploadBill } from "@/api/bills"
import { toast } from "sonner"

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]

export default function UploadCard() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  const reset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setProgress(0)
  }, [])

  const handleFile = useCallback((f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Invalid file type. Please upload a PDF, PNG, or JPG.")
      return
    }
    setFile(f)
    setProgress(0)

    if (f.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) handleFile(selected)
    },
    [handleFile]
  )

  const handleUpload = useCallback(async () => {
    if (!file) return
    setUploading(true)

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      await uploadBill(file)
      clearInterval(interval)
      setProgress(100)
      toast.success("Bill uploaded successfully!")
      setTimeout(() => navigate("/bills"), 500)
    } catch {
      clearInterval(interval)
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }, [file, navigate])

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
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              inputRef.current?.click()
            }
          }}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleChange}
            aria-hidden="true"
          />
          {!file ? (
            <>
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium">Drag & drop or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF, PNG, or JPG (max. 10MB)
              </p>
            </>
          ) : (
            <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-muted p-3">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-16 w-16 rounded object-cover"
                    />
                  ) : (
                    <File className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); reset() }}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {uploading && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {!uploading && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={(e) => { e.stopPropagation(); handleUpload() }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Bill
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
