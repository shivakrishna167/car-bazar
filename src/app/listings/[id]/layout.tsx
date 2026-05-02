import { Metadata, ResolvingMetadata } from 'next'
import { vehicleService } from '@/services/vehicleService'

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const vehicle = await vehicleService.getVehicleById(params.id)
    
    if (!vehicle) {
      return {
        title: 'Vehicle Not Found - Friends Car Bazar',
      }
    }

    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} - Friends Car Bazar`
    const description = `Looking for a used ${vehicle.make} ${vehicle.model}? We have a ${vehicle.year} model for sale in ${vehicle.district || 'Khammam'}. Price: ₹${vehicle.price.toLocaleString('en-IN')}. Quality inspected and ready for a test drive.`
    const imageUrl = (vehicle.image_urls && vehicle.image_urls.length > 0) 
      ? vehicle.image_urls[0] 
      : vehicle.image_url || '/logo.png' // Fallback to a default image if available

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [imageUrl],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch (error) {
    return {
      title: 'Vehicle Details - Friends Car Bazar',
    }
  }
}

export default function VehicleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
