import { timingSafeEqual } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '7f3a9c2e81b4d06f9a5e3c7b21d84f60'

function validToken(token: string): boolean {
  const a = Buffer.from(token)
  const b = Buffer.from(ADMIN_TOKEN)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (typeof header !== 'string') {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  const [scheme, ...rest] = header.split(' ')
  const token = rest.join(' ')
  if (scheme !== 'Bearer' || !token || !validToken(token)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}
