import { MetadataRoute } from 'next'
import { vehicleService } from '@/services/vehicleService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://car-bazar-two.vercel.app'

  // Standard static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  let vehiclePages: MetadataRoute.Sitemap = []
  
  try {
    const vehicles = await vehicleService.getAllListings()
    
    vehiclePages = vehicles.map((vehicle) => ({
      url: `${baseUrl}/listings/${vehicle.id}`,
      lastModified: vehicle.created_at ? new Date(vehicle.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error generating sitemap for vehicles:', error)
  }

  return [...staticPages, ...vehiclePages]
}
