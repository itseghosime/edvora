"use client";
import { usePupilsQuery } from '@/lib/query/hooks';
import ErrorState from './ErrorState';

export default function PortalDataBoundary({children}:{children:React.ReactNode}) {
  const query=usePupilsQuery();
  if (query.isPending) return <p role="status" className="p-8 text-on-surface-variant">Loading school records…</p>;
  if (query.error) return <ErrorState title="School records unavailable" message={query.error.message} onRetry={()=>{void query.refetch();}} />;
  return <>{children}</>;
}
