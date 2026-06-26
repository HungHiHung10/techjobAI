function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url')
}

function base64UrlDecode(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
}

export function publicUser(user) {
  return {
    id: String(user.id || 'demo'),
    name: user.name || 'Demo User',
    email: user.email || 'demo@techjob.ai',
  }
}

export function createDemoToken(user) {
  const safeUser = publicUser(user)
  return `demo.${base64UrlEncode({
    ...safeUser,
    iat: Date.now(),
  })}`
}

export function readDemoToken(req) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''
  if (!token.startsWith('demo.')) return null

  try {
    return publicUser(base64UrlDecode(token.slice('demo.'.length)))
  } catch {
    return null
  }
}

export function sendJson(res, status, payload) {
  res.status(status).json(payload)
}
