export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      if (state.includes(action.id)) {
        return state.filter((id) => id !== action.id)
      }
      return [...state, action.id]
    default:
      return state
  }
}

export function loadFavourites() {
  try {
    const saved = localStorage.getItem('favourites')
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
