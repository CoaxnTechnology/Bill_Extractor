import UploadCard from "@/components/UploadCard"

export default function Upload() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Bill</h1>
        <p className="text-muted-foreground mt-1">
          Upload a PDF or image of a bill for processing.
        </p>
      </div>
      <UploadCard />
    </div>
  )
}
