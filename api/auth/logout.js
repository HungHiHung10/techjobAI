import { sendJson } from './_token.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed' })
    return
  }

  sendJson(res, 200, { ok: true })
}
