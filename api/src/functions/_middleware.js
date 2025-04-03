export const handler = async (event, context, cb) => {
  return await cb(event, context)
}

export const before = () => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*', // hoặc chỉ định domain cụ thể
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  }
}
