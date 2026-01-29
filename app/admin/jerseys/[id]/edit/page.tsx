import { getJerseyById } from '@/services/jerseys'
import { notFound } from 'next/navigation'
import JerseyEditForm from './JerseyEditForm' // Renamed to fix IDE resolution

export default async function EditJerseyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jersey = await getJerseyById(id)
  
  if (!jersey) notFound()

  return <JerseyEditForm jersey={jersey} />
}
