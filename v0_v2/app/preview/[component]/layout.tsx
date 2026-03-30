import '@/app/globals.css';

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#0a0a1a]">
      {children}
    </div>
  );
}
