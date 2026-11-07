import { test, expect } from '@playwright/test'

const routes = [
  ['/', 'Suas mãos merecem um acabamento impecável'],
  ['/sobre', 'Cuidado que começa antes do esmalte'],
  ['/servicos', 'O que fazemos por aqui'],
  ['/cores', 'Alguns dos nossos esmaltes favoritos'],
  ['/estilos', 'Escolha o formato da sua unha'],
  ['/depoimentos', 'Quem já passou por aqui'],
  ['/localizacao', 'Onde nos encontrar'],
  ['/agendamento', 'Vamos marcar o seu horário?'],
]

test('todas as rotas abrem diretamente e se adaptam à tela', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const [route, heading] of routes) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
    await expect(page).toHaveTitle(/Nails Academy/)
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    for (const image of await page.locator('img[src*="/images/"]').all()) {
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    }
    if (['/', '/cores', '/agendamento'].includes(route)) await page.screenshot({ path: testInfo.outputPath(`${route.slice(1) || 'inicio'}.png`), fullPage: true })
  }
  expect(errors).toEqual([])
})

test('menu, histórico, links antigos e página inexistente', async ({ page, isMobile }) => {
  await page.goto('/')
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.getByRole('navigation', { name: 'Navegação móvel' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
    await page.getByRole('button', { name: 'Abrir menu' }).click()
  }
  const navigation = page.getByRole('navigation', { name: isMobile ? 'Navegação móvel' : 'Navegação principal', exact: true })
  await navigation.getByRole('link', { name: 'Serviços', exact: true }).click()
  await expect(page).toHaveURL('/servicos')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('O que fazemos por aqui')
  if (isMobile) await expect(page.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false')
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Suas mãos')
  await page.goto('/servicos.html')
  await expect(page).toHaveURL('/servicos')
  await page.goto('/pagina-inexistente')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Página não encontrada')
  await page.getByRole('link', { name: 'Voltar ao início' }).click()
  await expect(page).toHaveURL('/')
})

test('galerias abrem imagens e amostras, WhatsApp correto e foco restaurado', async ({ page }) => {
  for (const [route, name, cta, hasImage] of [
    ['/cores', 'Vinho Profundo', 'Quero esse tom', true],
    ['/cores', 'Nude Cerâmica', 'Quero esse tom', false],
    ['/estilos', 'Bailarina', 'Quero esse formato', true],
  ] as const) {
    await page.goto(route)
    const card = page.getByRole('button', { name: new RegExp(name) })
    await card.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading')).toHaveText(name)
    const href = await dialog.getByRole('link', { name: cta }).getAttribute('href')
    expect(href).toContain('https://wa.me/5583991236614?text=')
    expect(decodeURIComponent(href!)).toContain(name)
    if (hasImage) await expect.poll(() => dialog.locator('img').evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    else await expect(dialog.getByText('Amostra de cor')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(card).toBeFocused()
    await expect(page.locator('body')).not.toHaveClass(/modal-open/)
  }
})

test('mapa é recriado ao voltar à localização sem erros', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('https://*.tile.openstreetmap.org/**', route => route.abort())
  await page.goto('/localizacao')
  await expect(page.locator('.leaflet-container')).toBeVisible()
  await expect(page.getByRole('status')).toContainText('O mapa está indisponível')
  await expect(page.getByRole('link', { name: 'Traçar rota' })).toHaveAttribute('href', /destination=-6\.975/)
  await page.locator('footer').getByRole('link', { name: 'Sobre', exact: true }).click()
  await page.locator('footer').getByRole('link', { name: 'Localização', exact: true }).click()
  await expect(page.locator('.leaflet-container')).toBeVisible()
  expect(errors).toEqual([])
})
