import { createDemoToken, publicUser, sendJson } from './_token.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed' })
    return
  }

  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!name || !email || !password) {
    sendJson(res, 400, { message: 'Vui lòng nhập đầy đủ thông tin.' })
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendJson(res, 400, { message: 'Email không hợp lệ.' })
    return
  }
  if (password.length < 6) {
    sendJson(res, 400, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    return
  }

  const user = {
    id: `user-${Buffer.from(email).toString('base64url').slice(0, 12)}`,
    name,
    email,
  }

  sendJson(res, 200, {
    token: createDemoToken(user),
    user: publicUser(user),
    note: 'Demo auth is stateless on Vercel. Use any email with a 6+ character password to sign in.',
  })
}
