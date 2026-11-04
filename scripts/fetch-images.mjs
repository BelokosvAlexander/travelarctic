import { createHash } from 'node:crypto'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outputDirectory = process.env.IMAGE_OUTPUT_DIR || path.resolve('public/images')
const filter = process.argv[2]

const sources = [
  {
    id: 'teriberka',
    title: 'Sergei Gussev — Teriberka coast / Pexels License',
    urls: [
      'https://images.pexels.com/photos/9740984/pexels-photo-9740984.jpeg?auto=compress&cs=tinysrgb&w=1800',
      'https://images.pexels.com/photos/9740984/pexels-photo-9740984.jpeg',
    ],
    outputs: ['hero-teriberka.jpg', 'teriberka-vertical.jpg'],
    fallback: 'img/Териберка.jpg',
  },
  {
    id: 'kizhi',
    title: 'MatthiasKabel — Kizhi churches / CC BY-SA 3.0',
    filename: 'Kizhi_churches.jpg',
    outputs: ['kizhi.jpg'],
    fallback: 'img/Кижи.jpg',
  },
  {
    id: 'solovki',
    title: 'Trasprd — Solovetsky Monastery / CC BY-SA 4.0',
    filename: 'Solovetsky_Monastery_drone_1.jpg',
    outputs: ['solovki.jpg'],
    fallback: 'img/Соловки.jpg',
  },
  {
    id: 'franz',
    title: 'Christopher Michel — Franz Josef Land / CC BY 2.0',
    filename: 'Franz_Josef_Land_(18988581584).jpg',
    outputs: ['franz-josef.jpg'],
    fallback: 'img/Арктика(1).jpg',
  },
]

function wikimediaUrls(filename) {
  const digest = createHash('md5').update(filename).digest('hex')
  const encoded = encodeURIComponent(filename)
  const directory = `${digest[0]}/${digest.slice(0, 2)}`
  return [
    `https://upload.wikimedia.org/wikipedia/commons/thumb/${directory}/${encoded}/1800px-${encoded}`,
    `https://upload.wikimedia.org/wikipedia/commons/${directory}/${encoded}`,
    `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encoded}?width=1800`,
  ]
}

async function download(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000),
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
    try {
      console.log(`Загрузка: ${url}`)
      return await download(url)
    } catch (error) {
      lastError = error
      console.warn(`Не удалось загрузить источник: ${error.message}`)
    }
  }
  throw lastError
}

await mkdir(outputDirectory, { recursive: true })

for (const source of sources) {
  if (filter && source.id !== filter) continue
  console.log(`\n${source.title}`)
  try {
    const input = await downloadWithFallback(source.urls || wikimediaUrls(source.filename))
    for (const name of source.outputs) {
      await writeFile(path.join(outputDirectory, name), input)
      console.log(`Создан ${name}: ${Math.round(input.length / 1024)} KB`)
    }
  } catch (error) {
    console.warn(`Используется архивная фотография из репозитория: ${error.message}`)
    for (const name of source.outputs) {
      await copyFile(path.resolve(source.fallback), path.join(outputDirectory, name))
      console.log(`Скопирован резервный файл ${name}`)
    }
  }
}

if (filter && !sources.some(source => source.id === filter)) {
  throw new Error(`Неизвестный источник «${filter}». Доступны: ${sources.map(source => source.id).join(', ')}`)
}

console.log(`\nГотово: ${outputDirectory}`)
