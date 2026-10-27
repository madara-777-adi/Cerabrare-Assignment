import { useState, useEffect } from 'react'

export function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPhotos() {
      try {
        const res = await fetch('https://picsum.photos/v2/list?limit=30')
        if (!res.ok) {
          throw new Error('Could not load photos')
        }
        const data = await res.json()
        setPhotos(data)
      } catch {
        setError('Could not load photos')
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  return { photos, loading, error }
}
