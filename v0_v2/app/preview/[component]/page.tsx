'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';

// named export를 default로 변환하여 dynamic import
const componentMap: Record<string, ReturnType<typeof dynamic>> = {
  'transport-bar': dynamic(
    () =>
      import('@/components/cybo/transport-bar').then((mod) => ({
        default: mod.TransportBar,
      })),
    { ssr: false }
  ),
};

export default function PreviewPage() {
  const params = useParams();
  const componentName = params.component as string;

  const Component = useMemo(
    () => componentMap[componentName] || null,
    [componentName]
  );

  if (!Component) {
    return (
      <div className="w-full h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[14px] text-[#505070] font-medium">
            Component not found
          </p>
          <p className="text-[12px] text-[#404060] mt-1">
            &quot;{componentName}&quot; is not registered in preview map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a1a] p-4">
      <Suspense
        fallback={
          <div className="w-full h-32 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <Component />
      </Suspense>
    </div>
  );
}
