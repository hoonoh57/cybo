import VideoTimeline from "@/components/video-timeline"

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#0a0a18" }}>
      <div className="w-full max-w-7xl rounded-lg overflow-hidden shadow-2xl border" style={{ borderColor: "#2a2a4a" }}>
        <VideoTimeline />
      </div>
    </main>
  )
}
