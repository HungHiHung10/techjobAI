import { query, sendError } from './_db.js'

export default async function handler(_req, res) {
  try {
    const rows = await query(`
      WITH top_skills AS (
        SELECT skill_id
        FROM warehouse_marts.mart_skill_demand
        GROUP BY skill_id
        ORDER BY SUM(job_count) DESC
        LIMIT 5
      )
      SELECT
        s.skill_name,
        DATE_TRUNC('month', m.week_start)::DATE AS month,
        SUM(m.job_count)::int AS job_count
      FROM warehouse_marts.mart_skill_demand m
      JOIN warehouse_warehouse.dim_skill s ON m.skill_id = s.skill_id
      WHERE m.skill_id IN (SELECT skill_id FROM top_skills)
      GROUP BY s.skill_name, month
      ORDER BY month, s.skill_name
    `)
    res.status(200).json({ data: rows })
  } catch (error) {
    sendError(res, error)
  }
}
