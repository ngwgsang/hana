import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } _context - contains information about the invocation,
 * function, and execution environment.
 */
import { createAnkiCard } from 'src/lib/createAnkiCardHelper'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    // Trả về phản hồi cho preflight request
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    }
  }

  try {
    const body = JSON.parse(event.body)

    const { front, back } = body

    if (!front || !back) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Thiếu front hoặc back' }),
      }
    }

    const result = await createAnkiCard({
      front,
      back,
      tagIds: [2], // tag mặc định nếu có
      point: -3,
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Thêm thành công',
        card: result,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    }
  }
}
