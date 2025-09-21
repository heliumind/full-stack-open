export const changeFilter = (filter) => {
  return {
    type: 'SET_FILTER',
    payload: { filter },
  }
}

const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload.filter
    default:
      return state
  }
}

export default reducer
