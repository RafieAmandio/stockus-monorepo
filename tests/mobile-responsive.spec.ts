import { test, expect, Page } from '@playwright/test'
import path from 'path'

const SCREENSHOT_DIR = path.join(__dirname, '..', 'test-screenshots')

const viewports = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'ipad', width: 768, height: 1024 },
  { name: 'ipad-landscape', width: 1024, height: 768 },
]

const sections = [
  { selector: '[data-hero]', name: 'hero' },
  { selector: 'section.bg-custom-secondary:has(h2)', name: 'why-indonesian', index: 0 },
  { selector: 'section.bg-main-black:has(h2)', name: 'stock-performance', index: 0 },
  { selector: 'section.bg-brand:first-of-type', name: 'fundamentals' },
  { selector: 'section.bg-main-black', name: 'community', index: 1 },
  { selector: 'section.bg-main-black', name: 'community-features', index: 2 },
  { selector: 'section.bg-brand', name: 'what-people-say', index: 1 },
  { selector: 'section.bg-custom-secondary', name: 'is-right-for-u', index: 1 },
  { selector: 'section.bg-custom-secondary', name: 'what-you-get', index: 2 },
  { selector: 'section.bg-main-black', name: 'join-membership', index: 3 },
  { selector: 'section.bg-main-white', name: 'faq' },
  { selector: 'footer', name: 'footer' },
]

async function screenshotSection(page: Page, sectionDef: typeof sections[0], viewport: typeof viewports[0]) {
  try {
    let el
    if (sectionDef.index !== undefined) {
      const elements = await page.$$(sectionDef.selector)
      el = elements[sectionDef.index]
    } else {
      el = await page.$(sectionDef.selector)
    }

    if (!el) {
      console.log(`  [SKIP] ${sectionDef.name} - not found`)
      return
    }

    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    const filePath = path.join(SCREENSHOT_DIR, `${sectionDef.name}-${viewport.name}.png`)
    await el.screenshot({ path: filePath })
    console.log(`  [OK] ${sectionDef.name}`)
  } catch (e) {
    console.log(`  [ERR] ${sectionDef.name}: ${e}`)
  }
}

// Also take a full-page screenshot for horizontal overflow check
async function checkHorizontalOverflow(page: Page, viewport: typeof viewports[0]) {
  // Check if user can actually scroll horizontally (body has overflow-x: hidden, so check window scroll range)
  const result = await page.evaluate(() => {
    const maxScroll = document.documentElement.scrollWidth - document.documentElement.clientWidth
    // Try to scroll right
    window.scrollTo({ left: 9999 })
    const actualScroll = window.scrollX
    window.scrollTo({ left: 0 })
    return { maxScroll, actualScroll, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }
  })
  const hasOverflow = result.actualScroll > 0
  console.log(`  Viewport ${viewport.name}: scrollWidth=${result.scrollWidth}, clientWidth=${result.clientWidth}, canScroll=${hasOverflow}`)
  return hasOverflow
}

test('capture all sections at all breakpoints', async ({ page }) => {
  // Give sections time to render + animate
  page.setDefaultTimeout(30000)

  for (const viewport of viewports) {
    console.log(`\n=== ${viewport.name} (${viewport.width}x${viewport.height}) ===`)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Full page screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `full-page-${viewport.name}.png`),
      fullPage: true,
    })
    console.log(`  [OK] full-page`)

    // Check horizontal overflow - user should not be able to scroll horizontally
    const hasOverflow = await checkHorizontalOverflow(page, viewport)
    expect(hasOverflow, `Horizontal scroll possible at ${viewport.name}`).toBe(false)

    // Screenshot each section
    for (const section of sections) {
      await screenshotSection(page, section, viewport)
    }
  }
})
