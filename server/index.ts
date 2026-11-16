import express from 'express'
import { publicApi, adminApi, errorHandler } from './routes.js'
import { requireAuth } from './auth.js'

const app = express()

app.use(express.json())

app.use('/api', publicApi)
app.use('/api/admin', requireAuth, adminApi)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use(errorHandler)

const PORT = Number(process.env.PORT ?? 3001)

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
