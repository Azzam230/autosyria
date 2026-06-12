import CarDetail from "@/components/car/CarDetail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CarPage({ params }: PageProps) {
  const { id } = await params
  return <CarDetail id={id} />
}
