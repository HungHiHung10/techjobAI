import { query, sendError } from './_db.js'

export default async function handler(_req, res) {
  try {
    const [row] = await query(`
      SELECT
        (SELECT COUNT(*) FROM warehouse_warehouse.fact_job_postings) AS total_jobs,
        (SELECT COUNT(*) FROM warehouse_warehouse.dim_skill) AS total_skills,
        (SELECT COUNT(*) FROM warehouse_warehouse.dim_company) AS total_companies
    `)
    res.status(200).json({
      total_jobs: Number(row.total_jobs || 0),
      total_skills: Number(row.total_skills || 0),
      total_companies: Number(row.total_companies || 0),
    })
  } catch (error) {
    sendError(res, error)
  }
}
