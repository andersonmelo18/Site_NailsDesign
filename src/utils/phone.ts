export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  const split = digits.length > 10 ? 7 : 6
  const body = digits.slice(2, split)
  const tail = digits.slice(split)
  return `(${digits.slice(0, 2)}) ${body}${tail.length > 0 ? `-${tail}` : ''}`
}