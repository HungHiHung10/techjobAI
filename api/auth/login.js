import { createDemoToken, publicUser, sendJson } from './_token.js'

const DEMO_USER = {
  id: '1',
  name: 'Nguyễn Văn A',
  email: 'demo@techjob.ai',
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed' })
    return
  }

  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!email || !password) {
    sendJson(res, 400, { message: 'Vui lòng nhập email và mật khẩu.' })
    return
  }

  if (email === DEMO_USER.email && password !== 'demo123') {
    sendJson(res, 401, { message: 'Email hoặc mật khẩu không đúng.' })
    return
  }

  if (password.length < 6) {
    sendJson(res, 401, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    return
  }

  const user = email === DEMO_USER.email
    ? DEMO_USER
    : {
        id: `user-${Buffer.from(email).toString('base64url').slice(0, 12)}`,
        name: email.split('@')[0] || 'Demo User',
        email,
      }

  sendJson(res, 200, {
    token: createDemoToken(user),
    user: publicUser(user),
  })
}
