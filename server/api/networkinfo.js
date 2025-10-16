export default defineCachedEventHandler(async (event) => {
  try {
    return await getNetworkInfo()
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || `Failed to fetch network info: ${error.message}`
    })
  }
}, {
  maxAge: 30, // Cache for 30 seconds
  name: 'networkinfo'
})