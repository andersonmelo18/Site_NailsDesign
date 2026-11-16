import type { NextFunction, Request, Response } from 'express'
import { Router } from 'express'
import { db } from './db.js'
import { VERSION } from './meta.js'
import {
  parseBooking,
  parseColor,
  parseContact,
  parseId,
  parseService,
  parseStyle,
  parseTestimonial,
} from './validate.js'

export const publicApi = Router()

publicApi.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, version: VERSION })
})

publicApi.get('/services', (_req: Request, res: Response) => {
  res.json(db.prepare('SELECT id, name, description, price, duration FROM services ORDER BY id').all())
})

publicApi.get('/colors', (_req: Request, res: Response) => {
  res.json(db.prepare('SELECT id, name, hex, description, image FROM colors ORDER BY id').all())
})

publicApi.get('/styles', (_req: Request, res: Response) => {
  res.json(db.prepare('SELECT id, name, description, image FROM styles ORDER BY id').all())
})

publicApi.get('/testimonials', (_req: Request, res: Response) => {
  res.json(db.prepare('SELECT id, author, text, rating FROM testimonials ORDER BY id').all())
})

publicApi.post('/bookings', (req: Request, res: Response) => {
  const booking = parseBooking(req.body)
  if (!booking) {
    res.status(400).json({ error: 'Invalid booking payload' })
    return
  }
  const createdAt = new Date().toISOString()
  const result = db
    .prepare(
      'INSERT INTO bookings (name, phone, service, date, time, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .run(
      booking.name,
      booking.phone,
      booking.service,
      booking.date,
      booking.time,
      booking.notes,
      'pending',
      createdAt,
    )
  res.status(201).json({ id: Number(result.lastInsertRowid), status: 'pending', createdAt })
})

publicApi.post('/contacts', (req: Request, res: Response) => {
  const contact = parseContact(req.body)
  if (!contact) {
    res.status(400).json({ error: 'Invalid contact payload' })
    return
  }
  const createdAt = new Date().toISOString()
  const result = db
    .prepare('INSERT INTO contacts (name, phone, message, created_at) VALUES (?, ?, ?, ?)')
    .run(contact.name, contact.phone, contact.message, createdAt)
  res.status(201).json({ id: Number(result.lastInsertRowid), createdAt })
})

export const adminApi = Router()

const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const

adminApi.get('/bookings', (_req: Request, res: Response) => {
  res.json(
    db
      .prepare('SELECT id, name, phone, service, date, time, notes, status, created_at FROM bookings ORDER BY id DESC')
      .all()
      .map((row) => {
        const { created_at, ...rest } = row as Record<string, unknown>
        return { ...rest, createdAt: created_at }
      }),
  )
})

adminApi.patch('/bookings/:id', (req: Request, res: Response) => {
  const id = parseId(String(req.params.id))
  const { status } = (req.body ?? {}) as Record<string, unknown>
  if (id === null || !BOOKING_STATUSES.includes(status as (typeof BOOKING_STATUSES)[number])) {
    res.status(400).json({ error: 'Invalid payload: status must be pending, confirmed, cancelled or completed' })
    return
  }
  const result = db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id)
  if (result.changes === 0) {
    res.status(404).json({ error: 'Booking not found' })
    return
  }
  const row = db
    .prepare('SELECT id, name, phone, service, date, time, notes, status, created_at FROM bookings WHERE id = ?')
    .get(id) as Record<string, unknown>
  const { created_at, ...rest } = row
  res.json({ ...rest, createdAt: created_at })
})

adminApi.get('/contacts', (_req: Request, res: Response) => {
  res.json(
    db
      .prepare('SELECT id, name, phone, message, created_at FROM contacts ORDER BY id DESC')
      .all()
      .map((row) => {
        const { created_at, ...rest } = row as Record<string, unknown>
        return { ...rest, createdAt: created_at }
      }),
  )
})

function catalogRouter(
  table: string,
  columns: string,
  parse: (body: unknown) => Record<string, unknown> | null,
): Router {
  const router = Router()
  const selectColumns = columns.split(', ').map((column) => `${column} AS ${column}`).join(', ')

  router.get('/', (_req: Request, res: Response) => {
    res.json(db.prepare(`SELECT ${selectColumns} FROM ${table} ORDER BY id`).all())
  })

  router.post('/', (req: Request, res: Response) => {
    const row = parse(req.body)
    if (!row) {
      res.status(400).json({ error: 'Invalid payload' })
      return
    }
    const keys = Object.keys(row)
    const result = db
      .prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`)
      .run(...keys.map((key) => row[key]))
    res.status(201).json(db.prepare(`SELECT ${selectColumns} FROM ${table} WHERE id = ?`).get(Number(result.lastInsertRowid)))
  })

  router.patch('/:id', (req: Request, res: Response) => {
    const id = parseId(String(req.params.id))
    if (id === null) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }
    const row = parse(req.body)
    if (!row) {
      res.status(400).json({ error: 'Invalid payload' })
      return
    }
    const keys = Object.keys(row)
    const result = db
      .prepare(`UPDATE ${table} SET ${keys.map((key) => `${key} = ?`).join(', ')} WHERE id = ?`)
      .run(...keys.map((key) => row[key]), id)
    if (result.changes === 0) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(db.prepare(`SELECT ${selectColumns} FROM ${table} WHERE id = ?`).get(id))
  })

  router.delete('/:id', (req: Request, res: Response) => {
    const id = parseId(String(req.params.id))
    if (id === null) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }
    const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id)
    if (result.changes === 0) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(204).send()
  })

  return router
}

adminApi.use('/services', catalogRouter('services', 'id, name, description, price, duration', (body) => {
  const parsed = parseService(body)
  return parsed ? { ...parsed } : null
}))
adminApi.use('/colors', catalogRouter('colors', 'id, name, hex, description, image', (body) => {
  const parsed = parseColor(body)
  return parsed ? { ...parsed } : null
}))
adminApi.use('/styles', catalogRouter('styles', 'id, name, description, image', (body) => {
  const parsed = parseStyle(body)
  return parsed ? { ...parsed } : null
}))
adminApi.use('/testimonials', catalogRouter('testimonials', 'id, author, text, rating', (body) => {
  const parsed = parseTestimonial(body)
  return parsed ? { ...parsed } : null
}))

export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err)
    return
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON body' })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
