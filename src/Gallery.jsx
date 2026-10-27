import { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import { useFetchPhotos } from './useFetchPhotos'
import { favouritesReducer, loadFavourites } from './favouritesReducer'

function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [favs, dispatch] = useReducer(favouritesReducer, [], loadFavourites)
  const [search, setSearch] = useState('')

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favs))
  }, [favs])

  const handleSearch = useCallback((e) => setSearch(e.target.value), [])

  const filtered = useMemo(
    () => photos.filter((p) => p.author.toLowerCase().includes(search.toLowerCase())),
    [photos, search]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-orange-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-800 flex items-center justify-center p-4">
        <div className="border border-stone-300 bg-white p-4 rounded text-center">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by author"
          className="block w-full max-w-sm bg-white border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-orange-600 mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((photo) => {
            const isFav = favs.includes(photo.id)

            return (
              <div
                key={photo.id}
                className="bg-white border border-stone-300 hover:border-stone-500 rounded overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/id/${photo.id}/400/300`}
                  alt={photo.author}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-3 flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-wide truncate">
                    {photo.author}
                  </span>
                  <button
                    type="button"
                    aria-label="Toggle favourite"
                    aria-pressed={isFav}
                    onClick={() => dispatch({ type: 'TOGGLE', id: photo.id })}
                    className={
                      isFav
                        ? 'text-orange-600 cursor-pointer'
                        : 'text-stone-500 hover:text-orange-600 cursor-pointer'
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isFav ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Gallery
