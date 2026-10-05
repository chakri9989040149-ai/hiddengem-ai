import HiddenDiscoveryResultClient from './HiddenDiscoveryResultClient';

export function generateStaticParams() {
  return [
    { id: 'latest' },
    { id: 'tirupati' },
    { id: 'hampi' },
    { id: 'munnar' },
    { id: 'demo' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HiddenDiscoveryResultPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <HiddenDiscoveryResultClient id={resolvedParams.id} />;
}
