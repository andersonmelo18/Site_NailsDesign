import type { NailOption } from '../data/catalog'
import { fetchColors, fetchStyles } from './client'
import type { Color, Style } from './types'

const shapeClassByName: Record<string, string> = {
  amendoada: 'shape-almond',
  stiletto: 'shape-stiletto',
  bailarina: 'shape-ballerina',
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function shadeHex(hex: string, ratio: number): string {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? value.split('').map(char => char + char).join('') : value
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return hex
  const channel = (start: number): string => {
    const part = Number.parseInt(full.slice(start, start + 2), 16)
    const next = ratio < 0 ? part * (1 + ratio) : part + (255 - part) * ratio
    return Math.max(0, Math.min(255, Math.round(next))).toString(16).padStart(2, '0')
  }
  return `#${channel(0)}${channel(2)}${channel(4)}`
}

export function toColorOptions(colors: Color[]): NailOption[] {
  return colors.map(color => ({
    id: color.id,
    name: color.name,
    description: color.description,
    kind: 'cor',
    image: color.image ?? undefined,
    gradient: `linear-gradient(160deg, ${color.hex}, ${shadeHex(color.hex, -0.32)})`,
  }))
}

export function toStyleOptions(styles: Style[]): NailOption[] {
  return styles.map(style => ({
    id: style.id,
    name: style.name,
    description: style.description,
    kind: 'formato',
    image: style.image ?? undefined,
    shapeClass: shapeClassByName[normalizeName(style.name)],
  }))
}

export function loadColorOptions(): Promise<NailOption[]> {
  return fetchColors().then(toColorOptions)
}

export function loadStyleOptions(): Promise<NailOption[]> {
  return fetchStyles().then(toStyleOptions)
}