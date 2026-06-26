import { query, sendError } from './_db.js'

export default async function handler(_req, res) {
  try {
    const rows = await query(`
      SELECT
        COALESCE(lvl.level_name_vi, 'Không xác định') AS level_name_vi,
        COALESCE(lvl.seniority_order, 999) AS seniority_order,
        COUNT(*)::int AS job_count
      FROM warehouse_warehouse.fact_job_postings f
      LEFT JOIN warehouse_warehouse.dim_job_level AS lvl USING (job_level_id)
      GROUP BY lvl.level_name_vi, lvl.seniority_order
      ORDER BY seniority_order, job_count DESC
    `)
    res.status(200).json({ data: rows })
  } catch (error) {
    sendError(res, error)
  }
}
