export default defineCachedEventHandler(async (event) => {
  try {
    return await getTransactionPool()
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || `Failed to fetch transaction pool: ${error.message}`
    })
  }
}, {
  maxAge: 30, // Cache for 30 seconds
  name: 'mempool'
})