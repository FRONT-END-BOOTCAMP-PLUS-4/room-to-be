'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const SimulatorPage = dynamic(() => import('../../simulator/SimulatorPage'), {
  ssr: false,
});

export default function EditSimulatorPage() {
  const { roomId } = useParams();

  return <SimulatorPage mode='edit' roomId={roomId as string} />;
}
