import { colors, shapes, services, testimonials } from '../src/data/catalog.ts'
import { db } from './db.js'

const firstHexOf = (gradient?: string): string => gradient?.match(/#[0-9a-fA-F]{6}/)?.[0] ?? '#000000'

const seed = db.transaction(() => {
  for (const table of ['bookings', 'contacts', 'services', 'colors', 'styles', 'testimonials']) {
    db.prepare(`DELETE FROM ${table}`).run()
  }
  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('bookings','contacts','services','colors','styles','testimonials')").run()

  const insertService = db.prepare('INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)')
  const insertColor = db.prepare('INSERT INTO colors (name, hex, description, image) VALUES (?, ?, ?, ?)')
  const insertStyle = db.prepare('INSERT INTO styles (name, description, image) VALUES (?, ?, ?)')
  const insertTestimonial = db.prepare('INSERT INTO testimonials (author, text, rating) VALUES (?, ?, ?)')

  for (const service of services) {
    insertService.run(service.name, service.description, service.price, service.duration)
  }

  for (const color of colors) {
    insertColor.run(color.name, firstHexOf(color.gradient), color.description, color.image ?? null)
  }

  for (const shape of shapes) {
    insertStyle.run(shape.name, shape.description, shape.image ?? null)
  }

  for (const testimonial of testimonials) {
    insertTestimonial.run(testimonial.author, testimonial.text, testimonial.rating)
  }
})

seed()

const counts = [
  db.prepare('SELECT COUNT(*) AS n FROM services').get() as { n: number },
  db.prepare('SELECT COUNT(*) AS n FROM colors').get() as { n: number },
  db.prepare('SELECT COUNT(*) AS n FROM styles').get() as { n: number },
  db.prepare('SELECT COUNT(*) AS n FROM testimonials').get() as { n: number },
]
console.log(`Seeded: ${counts.map((c) => c.n).join(', ')} rows (services, colors, styles, testimonials)`)
