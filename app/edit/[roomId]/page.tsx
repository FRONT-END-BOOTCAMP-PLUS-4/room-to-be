'use client';

import { useParams } from 'next/navigation';

import SimulatorPage from '../../simulator/SimulatorPage';

export default function EditSimulatorPage() {
  const { roomId } = useParams();

  return <SimulatorPage mode='edit' roomId={roomId as string} />;
}
