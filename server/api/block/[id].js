export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Determine if id is a height (number) or hash (string)
  const height = /^\d+$/.test(id) ? parseInt(id, 10) : null
  const hash = height === null ? id : null

  try {
    return await getBlock(height, hash)
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || `Failed to fetch transaction pool: ${error.message}`
    })
  }
}, {
  maxAge: 300, // Cache for 5 minutes
  name: (event) => `b-${getRouterParam(event, 'id')}`
})