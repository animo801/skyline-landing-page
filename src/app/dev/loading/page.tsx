import { notFound } from 'next/navigation';
import LoadingPreview from './LoadingPreview';

// Local-only preview of the quote loading screen. Returns 404 in
// production builds, so it never exists on the live site.
export default function LoadingPreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <LoadingPreview />;
}
