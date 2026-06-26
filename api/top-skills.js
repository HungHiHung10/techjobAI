import { query, sendError } from './_db.js'

export default async function handler(req, res) {
  try {
    const rawLimit = Number(req.query.limit || 20)
    const limit = Math.max(1, Math.min(Number.isFinite(rawLimit) ? rawLimit : 20, 200))
    const rows = await query(
      `
      SELECT skill_name, SUM(job_count)::int AS total_jobs
      FROM warehouse_marts.mart_skill_demand
      GROUP BY skill_name
      ORDER BY total_jobs DESC
      LIMIT $1
      `,
      [limit],
    )
    res.status(200).json({ data: rows })
  } catch (error) {
    sendError(res, error)
  }
}
