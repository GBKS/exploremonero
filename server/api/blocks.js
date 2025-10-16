export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)

  const start = query.start ? parseInt(query.start) : 0
  const count = query.count ? parseInt(query.count) : 10

  try {
    return await getBlocks(start, count)
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || `Failed to fetch blocks: ${error.message}`
    })
  }
}, {
  maxAge: 300, // Cache for 5 minutes
  name: (event) => {
    const query = getQuery(event)
    return `bs-${query.start}-${query.count}`
  }
})