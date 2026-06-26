import { readDemoToken, sendJson } from './_token.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { message: 'Method not allowed' })
    return
  }

  const user = readDemoToken(req)
  if (!user) {
    sendJson(res, 401, { message: 'Unauthorized' })
    return
  }

  sendJson(res, 200, user)
}
