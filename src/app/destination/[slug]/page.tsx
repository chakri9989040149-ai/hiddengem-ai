import DestinationDetailClient from './DestinationDetailClient';
import { DESTINATIONS } from '@/lib/data/seed';

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({
    slug: d.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <DestinationDetailClient slug={resolvedParams.slug} />;
}
