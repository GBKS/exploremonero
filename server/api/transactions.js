export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const transactionHashes = query.h ? query.h.split(',') : []

  try {
    return await getTransactions(transactionHashes)
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || `Failed to fetch blocks: ${error.message}`
    })
  }
}, {
  maxAge: 5, // Cache for 5 seconds
  name: (event) => {
    const query = getQuery(event)
    return `t-${query.h}`
  }
})