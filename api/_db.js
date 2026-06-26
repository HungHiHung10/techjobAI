import pg from 'pg'

const { Pool } = pg

let pool

function sslConfig() {
  const sslMode = (process.env.PGSSLMODE || process.env.POSTGRES_SSLMODE || '').toLowerCase()
  const host = process.env.POSTGRES_HOST || process.env.NEON_HOST || ''
  if (sslMode === 'require' || host.includes('neon.tech')) {
    return { rejectUnauthorized: false }
  }
  return undefined
}

export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || process.env.NEON_HOST,
      port: Number(process.env.POSTGRES_PORT || process.env.NEON_PORT || 5432),
      database: process.env.POSTGRES_DB || process.env.NEON_DB,
      user: process.env.POSTGRES_USER || process.env.NEON_USER,
      password: process.env.POSTGRES_PASSWORD || process.env.NEON_PASSWORD,
      ssl: sslConfig(),
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    })
  }
  return pool
}

export async function query(sql, params = []) {
  const result = await getPool().query(sql, params)
  return result.rows
}

export function sendError(res, error) {
  console.error('Database API failed', error)
  res.status(500).json({
    message: 'Không thể tải dữ liệu từ database.',
    detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
  })
}
