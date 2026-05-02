'use client'

/**
 * Retrieves a persistent local ID from localStorage or creates a new one.
 * Used for identifying anonymous users for features like wishlists.
 */
export function getLocalId(): string {
  if (typeof window === 'undefined') return ''

  let localId = localStorage.getItem('friends_car_bazar_local_id')
  
  if (!localId) {
    localId = `local_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString(36)}`
    localStorage.setItem('friends_car_bazar_local_id', localId)
  }
  
  return localId
}

/**
 * Helper to check if a ID is a local ID
 */
export function isLocalId(id: string): boolean {
  return id.startsWith('local_')
}
