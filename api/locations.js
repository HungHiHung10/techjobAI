import { query, sendError } from './_db.js'

export default async function handler(_req, res) {
  try {
    const rows = await query(`
      SELECT
        COALESCE(l.city_name_vi, 'Không xác định') AS city_name_vi,
        m.job_count::int AS job_count
      FROM warehouse_marts.mart_location_demand m
      JOIN warehouse_warehouse.dim_location l ON m.city_id = l.city_id
      ORDER BY m.job_count DESC
    `)
    res.status(200).json({ data: rows })
  } catch (error) {
    sendError(res, error)
  }
}
