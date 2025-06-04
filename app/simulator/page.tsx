'use client';
import dynamic from 'next/dynamic';

const SimulatorPage = dynamic(() => import('@/app/simulator/SimulatorPage'), {
  ssr: false,
});
export default function CreateSimulatorPage() {
  return <SimulatorPage mode='create' />;
}
