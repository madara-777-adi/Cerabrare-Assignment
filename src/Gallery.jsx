import { useFetchPhotos } from './useFetchPhotos'

function Gallery() {
  const { photos, loading, error } = useFetchPhotos()

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <p>{photos.length} photos loaded</p>
      <ul>
        {photos.map((photo) => (
          <li key={photo.id}>{photo.author}</li>
        ))}
      </ul>
    </div>
  )
}

export default Gallery
