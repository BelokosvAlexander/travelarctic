import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const outputDirectory = process.env.IMAGE_OUTPUT_DIR || path.resolve('public/images')
const filter = process.argv[2]

const sources = [
  {
    id: 'teriberka',
    title: 'Sergei Gussev — Teriberka coast / Pexels License',
    urls: [
      'https://images.pexels.com/photos/9740984/pexels-photo-9740984.jpeg?auto=compress&cs=tinysrgb&w=1800',
      'https://images.pexels.com/photos/9740984/pexels-photo-9740984.jpeg',
      'https://www.pexels.com/download/9740984/',
    ],
    outputs: [
      { name: 'hero-teriberka.webp', width: 1800, height: 1200, format: 'webp', quality: 78 },
      { name: 'teriberka-vertical.webp', width: 1000, height: 1500, format: 'webp', quality: 80 },
      { name: 'og-cover.jpg', width: 1200, height: 630, format: 'jpeg', quality: 82 },
    ],
  },
  {
    id: 'kizhi',
    title: 'MatthiasKabel — Kizhi churches / CC BY-SA 3.0',
    filename: 'Kizhi_churches.jpg',
    outputs: [{ name: 'kizhi.webp', width: 1800, height: 1200, format: 'webp', quality: 80 }],
  },
  {
    id: 'solovki',
    title: 'Trasprd — Solovetsky Monastery / CC BY-SA 4.0',
    filename: 'Solovetsky_Monastery_drone_1.jpg',
    outputs: [{ name: 'solovki.webp', width: 1800, height: 1200, format: 'webp', quality: 80 }],
  },
  {
    id: 'franz',
    title: 'Christopher Michel — Franz Josef Land / CC BY 2.0',
    filename: 'Franz_Josef_Land_(18988581584).jpg',
    outputs: [{ name: 'franz-josef.webp', width: 1800, height: 1200, format: 'webp', quality: 80 }],
  },
]

function wikimediaUrls(filename) {
  const digest = createHash('md5').update(filename).digest('hex')
  const encoded = encodeURIComponent(filename)
  return [
    `https://upload.wikimedia.org/wikipedia/commons/${digest[0]}/${digest.slice(0, 2)}/${encoded}`,
    `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encoded}`,
  ]
}

async function download(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(30_000),
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) throw new Error(`Неизображение (${contentType || 'тип не указан'})`)
  return Buffer.from(await response.arrayBuffer())
}

async function downloadWithFallback(urls) {
  let lastError
  for (const url of urls) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        console.log(`Загрузка (попытка ${attempt}): ${url}`)
        return await download(url)
      } catch (error) {
        lastError = error
        console.warn(`Не удалось загрузить источник: ${error.message}`)
      }
    }
  }
  throw lastError
}

await mkdir(outputDirectory, { recursive: true })

for (const source of sources) {
  if (filter && source.id !== filter) continue
  console.log(`\n${source.title}`)
  const input = await downloadWithFallback(source.urls || wikimediaUrls(source.filename))
  for (const output of source.outputs) {
    let pipeline = sharp(input).rotate().resize(output.width, output.height, {
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: false,
    })
    pipeline = output.format === 'jpeg'
      ? pipeline.jpeg({ quality: output.quality, mozjpeg: true })
      : pipeline.webp({ quality: output.quality, effort: 6 })
    const result = await pipeline.toBuffer()
    await writeFile(path.join(outputDirectory, output.name), result)
    console.log(`Создан ${output.name}: ${Math.round(result.length / 1024)} KB`)
  }
}

if (filter && !sources.some(source => source.id === filter)) {
  throw new Error(`Неизвестный источник «${filter}». Доступны: ${sources.map(source => source.id).join(', ')}`)
}

console.log(`\nГотово: ${outputDirectory}`)
