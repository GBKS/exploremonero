export default defineEventHandler((event) => {
  const query = getQuery(event)

  return { query: query.q }
})