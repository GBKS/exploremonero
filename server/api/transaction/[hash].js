export default defineCachedEventHandler(async (event) => {
  const hash = getRouterParam(event, 'hash')

  try {
    return await getTransaction(hash)
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || `Failed to fetch transaction pool: ${error.message}`
    })
  }
}, {
  maxAge: 5, // Cache for 5 minutes
  name: (event) => `tr-${getRouterParam(event, 'hash')}`
})