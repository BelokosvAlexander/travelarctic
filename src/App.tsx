import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronRight,
  CloudSun, Compass, Download, ExternalLink, FileText, Menu, Phone, Printer, X,
} from 'lucide-react'
import './App.css'

type Source = { label: string; url: string }
type Highlight = { title: string; text: string }
type PlanStep = { title: string; text: string }
type DestinationId = 'kola' | 'kizhi' | 'solovki' | 'franz'
type QuizOption = { label: string; destination: DestinationId }
type QuizQuestion = { question: string; options: QuizOption[] }

type Destination = {
  id: DestinationId
  name: string
  shortName: string
  region: string
  image: string
  alt: string
  season: string
  duration: string
  note: string
  lead: string
  description: string
  highlights: Highlight[]
  plan: PlanStep[]
  caution: string
  sources: Source[]
}

const REVIEW_DATE = '4 ноября 2026'

const destinations: Destination[] = [
  {
    id: 'kola',
    name: 'Кольский полуостров',
    shortName: 'Кольский',
    region: 'Мурманская область · Баренцево море',
    image: './images/hero-teriberka.jpg',
    alt: 'Скалистое побережье Баренцева моря в Териберке',
    season: 'Лето и ранняя осень — для первой поездки',
    duration: '3–5 дней',
    note: 'Тундра, сопки и северный порт',
    lead: 'Здесь Арктика начинается с дороги: за окном меняются лес, тундра и каменистый берег, а план поездки подстраивается под ветер.',
    description: 'Кольский удобен для первого самостоятельного знакомства с Заполярьем. Мурманск даёт городской и исторический контекст, Териберка — встречу с Баренцевым морем, Хибины — горный ландшафт. Не пытайтесь объять всё за одни выходные: расстояния и погода требуют запаса времени.',
    highlights: [
      { title: 'Мурманск', text: 'Начните с Кольского залива, городских музеев и мемориалов. Ледокол «Ленин» и обзорные точки помогают понять связь города с морем и историей Северного флота.' },
      { title: 'Териберка', text: 'Посёлок у океана, старая и новая части, тундровые склоны и береговые маршруты. Состояние дороги, доступ к тропам и выход на берег проверяйте в день поездки.' },
      { title: 'Хибины', text: 'Горный массив рядом с Кировском и Апатитами. Для знакомства выбирайте доступные обзорные маршруты; в горы без подготовки и местного сопровождения не выходите.' },
      { title: 'Северное небо', text: 'Полярный день и полярная ночь меняют ощущение от одних и тех же мест. Северное сияние возможно только в тёмный сезон и никогда не гарантировано.' },
    ],
    plan: [
      { title: 'День 1 · Мурманск', text: 'Оставьте время на дорогу из аэропорта, спокойную прогулку и один музей. Не назначайте плотную программу сразу после прибытия.' },
      { title: 'День 2 · Териберка', text: 'Выезжайте после проверки трассы и ветра. Один природный маршрут и прогулка по посёлку лучше, чем гонка по всем фототочкам.' },
      { title: 'День 3 · Хибины или побережье', text: 'Выберите одно направление по сезону и самочувствию. Для незнакомой горной тропы берите проводника.' },
      { title: 'День 4 · Резерв', text: 'Используйте его для перенесённой поездки, музеев и возвращения. Если погода не мешала, это время для медленного знакомства с городом.' },
    ],
    caution: 'Дорога в Териберку может закрываться из-за погоды, а морские прогулки — отменяться. Не выходите на прибрежные камни при сильном прибое и не стройте поездку только вокруг сияния или наблюдения китов.',
    sources: [
      { label: 'Официальный гид по Мурманской области', url: 'https://murmansk.travel/' },
      { label: 'Прогноз Гидрометцентра России', url: 'https://meteoinfo.ru/' },
    ],
  },
  {
    id: 'kizhi',
    name: 'Кижи и Онежское озеро',
    shortName: 'Кижи',
    region: 'Карелия · Онежское озеро',
    image: './images/kizhi.jpg',
    alt: 'Деревянные церкви и колокольня Кижского погоста у воды',
    season: 'Летняя навигация; зимой — отдельные программы',
    duration: '2–3 дня',
    note: 'Деревянное зодчество и островная жизнь',
    lead: 'Кижи стоит воспринимать не как одну фотографию с церквями, а как целый остров, где архитектура, ремёсла и жизнь северных деревень складываются в единую историю.',
    description: 'Главная доминанта — Кижский погост, но смысл поездки шире: музей под открытым небом показывает, как строили, работали и жили в Заонежье. Оставьте время не только на основную экспозицию, но и на спокойную прогулку по разрешённым маршрутам острова.',
    highlights: [
      { title: 'Кижский погост', text: 'Преображенская и Покровская церкви, шатровая колокольня и ограда образуют ансамбль, который лучше рассматривать без спешки и с рассказом музейного гида.' },
      { title: 'Дома и экспозиции', text: 'Крестьянские дома, интерьеры и предметы быта раскрывают повседневность северной деревни. Состав доступных экспозиций зависит от сезона и музейной программы.' },
      { title: 'Островные маршруты', text: 'Деревни, часовни и виды на Кижские шхеры дополняют главный ансамбль. Двигайтесь по открытым для посетителей дорожкам и соблюдайте правила заповедника.' },
      { title: 'Ремёсла и традиции', text: 'Тематические экскурсии и демонстрации ремёсел помогают увидеть за архитектурой живую культуру. Проверяйте программу конкретной даты на сайте музея.' },
    ],
    plan: [
      { title: 'День 1 · Петрозаводск', text: 'Приезжайте накануне водной переправы, особенно если рейс ранний. Оставьте вечер на набережную и проверку билетов.' },
      { title: 'День 2 · Остров Кижи', text: 'Заложите почти полный день на переправу и музей. Уточните время стоянки: короткого рейса может хватить только на основную экспозицию.' },
      { title: 'День 3 · Резерв или Карелия', text: 'При плотной транспортной связке оставьте запас на погоду. Если всё идёт по плану, продолжите знакомство с Петрозаводском или Заонежьем.' },
    ],
    caution: 'Онежское озеро бывает неспокойным даже в тёплом сезоне. Навигация и зимние перевозки зависят от погоды и ледовой обстановки. Не выходите на лёд самостоятельно и не считайте прошлогоднее расписание гарантией текущего.',
    sources: [
      { label: 'Музей «Кижи»: как добраться и правила посещения', url: 'https://site.kizhi.karelia.ru/info/about/kizhi-island/' },
      { label: 'Официальный сайт музея-заповедника «Кижи»', url: 'https://kizhi.karelia.ru/' },
    ],
  },
  {
    id: 'solovki',
    name: 'Соловецкие острова',
    shortName: 'Соловки',
    region: 'Архангельская область · Белое море',
    image: './images/solovki.jpg',
    alt: 'Соловецкий монастырь, каменные стены и островная гавань с высоты',
    season: 'Тёплая навигация; межсезонье требует проверки',
    duration: '3–4 дня',
    note: 'Монастырь, память и Белое море',
    lead: 'На Соловках северная природа неразделима с историей — монастырской, морской и трагической. Сюда лучше приезжать с временем на чтение и тишину, а не только на обзорную экскурсию.',
    description: 'Большой Соловецкий остров объединяет монастырский ансамбль, музейные экспозиции, поселковую жизнь и морские ландшафты. Другие острова архипелага доступны не всегда: поездки зависят от навигации, погоды и организованных программ.',
    highlights: [
      { title: 'Монастырский ансамбль', text: 'Крепостные стены, башни, храмы и гавань формируют знакомый силуэт. Уточняйте правила посещения действующего монастыря и музейных пространств.' },
      { title: 'Музей и память', text: 'Экспозиции помогают увидеть разные слои истории архипелага, включая историю Соловецкого лагеря особого назначения. Этой теме нужно время и уважительный настрой.' },
      { title: 'Природа острова', text: 'Лесные дороги, озёра и морские берега подходят для спокойных прогулок по открытым маршрутам. Не сокращайте расстояние через незнакомую местность после наступления темноты.' },
      { title: 'Малые острова', text: 'Экскурсии к отдельным островам и историческим местам проводятся не круглый год. Отправление и возвращение зависят от морской обстановки.' },
    ],
    plan: [
      { title: 'День 1 · Дорога и посёлок', text: 'После переправы или перелёта оставьте свободное время. Начните с гавани, короткой прогулки и сверки музейных программ.' },
      { title: 'День 2 · Ансамбль и музей', text: 'Разделите день между монастырской территорией и экспозициями. Не планируйте дальнюю морскую экскурсию вплотную к обратной дороге.' },
      { title: 'День 3 · Остров', text: 'Выберите один природный или исторический маршрут с учётом погоды и доступного транспорта. Для удалённых мест берите организованную программу.' },
      { title: 'День 4 · Возвращение', text: 'Держите транспортный резерв, особенно при стыковке с поездом или самолётом на большой земле.' },
    ],
    caution: 'Морские переправы, экскурсии и авиасообщение зависят от сезона и погоды. Не покупайте неразрывную цепочку билетов без запаса времени. Водные поездки выбирайте только у организаторов, соблюдающих правила безопасности.',
    sources: [
      { label: 'Соловецкий музей-заповедник', url: 'https://www.solovky.ru/' },
      { label: 'Прогноз Гидрометцентра России', url: 'https://meteoinfo.ru/' },
    ],
  },
  {
    id: 'franz',
    name: 'Земля Франца-Иосифа',
    shortName: 'Земля Франца-Иосифа',
    region: 'Архангельская область · высокоширотная Арктика',
    image: './images/franz-josef.jpg',
    alt: 'Ледники и низкие облака над островами Земли Франца-Иосифа',
    season: 'Короткий экспедиционный сезон',
    duration: 'По программе экспедиции',
    note: 'Ледники, полярные пустыни и экспедиции',
    lead: 'Это не направление для самостоятельной поездки на выходные, а высокоширотная экспедиция, где маршрут каждый день уточняют капитан, лед и погода.',
    description: 'Архипелаг входит в национальный парк «Русская Арктика». Здесь нет привычной туристической инфраструктуры: посещение возможно в рамках согласованной экспедиции и при соблюдении правил особо охраняемой территории. Программа всегда остаётся ориентировочной.',
    highlights: [
      { title: 'Арктические пустыни', text: 'Ледниковые купола, каменистые берега и полярные моря формируют ландшафт, сильно отличающийся от доступного Русского Севера.' },
      { title: 'История открытий', text: 'Места стоянок и полярных исследований рассказывают о цене освоения Арктики. Доступ к конкретным объектам определяется экспедицией и правилами парка.' },
      { title: 'Птицы и морские животные', text: 'Птичьи базары, моржи и другие животные — часть дикой природы, а не гарантированное шоу. Наблюдение ведётся на безопасной дистанции и по указанию экспедиционной команды.' },
      { title: 'Работа экспедиции', text: 'Лекции, ледовая обстановка и решения капитана — такая же важная часть путешествия, как высадки. Ценность поездки не измеряется числом посещённых островов.' },
    ],
    plan: [
      { title: 'До поездки', text: 'Выбирайте оператора с опытом полярных экспедиций, изучайте договор, требования к здоровью, страховое покрытие и порядок изменения программы.' },
      { title: 'На судне', text: 'Пройдите инструктажи, соблюдайте правила посадки в экспедиционные лодки и носите спасательное снаряжение по указанию команды.' },
      { title: 'На высадке', text: 'Оставайтесь с группой и следуйте за проводниками. Самостоятельно удаляться от маршрута нельзя: в Арктике ошибка быстро становится аварийной ситуацией.' },
      { title: 'После возвращения', text: 'Не закладывайте критичных стыковок сразу после окончания экспедиции: сроки могут меняться из-за льда и погоды.' },
    ],
    caution: 'Самостоятельное посещение не рассматривайте как вариант. Ни высадки, ни встречи с белым медведем, ни конкретные даты возвращения не гарантированы. Все решения принимают капитан и экспедиционная команда с учётом безопасности и правил национального парка.',
    sources: [
      { label: 'Национальный парк «Русская Арктика»', url: 'https://rus-arc.ru/' },
      { label: 'МЧС России', url: 'https://mchs.gov.ru/' },
    ],
  },
]

const quizQuestions: QuizQuestion[] = [
  {
    question: 'Что должно остаться в памяти после поездки?',
    options: [
      { label: 'Дорога через тундру и встреча с Баренцевым морем', destination: 'kola' },
      { label: 'Деревянные церкви и истории северных деревень', destination: 'kizhi' },
      { label: 'Монастырь у Белого моря и неспешные прогулки по острову', destination: 'solovki' },
      { label: 'Ледники, полярные пустыни и жизнь на экспедиционном судне', destination: 'franz' },
    ],
  },
  {
    question: 'Сколько времени вы готовы выделить?',
    options: [
      { label: 'Короткая поездка на 2–3 дня', destination: 'kizhi' },
      { label: '3–5 дней с одним резервным днём', destination: 'kola' },
      { label: 'Столько, сколько длится экспедиция', destination: 'franz' },
      { label: '3–4 дня без жёсткого расписания', destination: 'solovki' },
    ],
  },
  {
    question: 'Какая дорога вам подходит?',
    options: [
      { label: 'Переправа или перелёт с запасом на погоду', destination: 'solovki' },
      { label: 'Самостоятельные выезды по автомобильным дорогам', destination: 'kola' },
      { label: 'Понятная связка: город, водная переправа, остров', destination: 'kizhi' },
      { label: 'Только организованная экспедиция: маршрут уточняет капитан', destination: 'franz' },
    ],
  },
  {
    question: 'Какой темп путешествия вам ближе?',
    options: [
      { label: 'Несколько мест вокруг одной базы, план зависит от погоды', destination: 'kola' },
      { label: 'Тишина, чтение, прогулки и отдельные экскурсии', destination: 'solovki' },
      { label: 'Лекции, высадки и готовность следовать экспедиционному плану', destination: 'franz' },
      { label: 'Одна главная тема и время на музей без спешки', destination: 'kizhi' },
    ],
  },
  {
    question: 'С какими условиями вы готовы мириться?',
    options: [
      { label: 'Зависимость от навигации и музейной программы', destination: 'kizhi' },
      { label: 'Более сложная логистика и ограниченный транспорт между островами', destination: 'solovki' },
      { label: 'Ветер, возможные закрытия дорог и перенос выездов', destination: 'kola' },
      { label: 'Отсутствие самостоятельного маршрута и гарантий высадок', destination: 'franz' },
    ],
  },
]

const quizResultCopy: Record<DestinationId, string> = {
  kola: 'Вам подходит самостоятельная поездка с несколькими впечатлениями: северный город, дорога через тундру, побережье и горы. Закладывайте резервный день и не планируйте маршрут вплотную.',
  kizhi: 'Вам ближе короткое путешествие с понятной культурной темой. Кижи позволяют сосредоточиться на деревянном зодчестве, быте северных деревень и спокойной прогулке по острову.',
  solovki: 'Вы готовы к более сложной дороге ради островного ритма, истории и тишины. На Соловках особенно важны запас времени и внимательное отношение к разным слоям истории архипелага.',
  franz: 'Вы выбираете не обычную туристическую поездку, а редкую полярную экспедицию. Здесь самостоятельный маршрут невозможен: программа, высадки и возвращение зависят от команды, льда и погоды.',
}

function getQuizResult(answers: DestinationId[]): DestinationId {
  const scores: Record<DestinationId, number> = { kola: 0, kizhi: 0, solovki: 0, franz: 0 }
  answers.forEach(answer => { scores[answer] += 1 })
  const highestScore = Math.max(...Object.values(scores))
  const leaders = destinations
    .map(destination => destination.id)
    .filter(id => scores[id] === highestScore)

  // При равенстве решает самый ранний ответ среди лидеров: главный мотив поездки важнее случайного порядка направлений.
  return answers.find(answer => leaders.includes(answer)) ?? 'kola'
}

const checklist = [
  'Проверить прогноз погоды, ветер и предупреждения на весь период поездки.',
  'Уточнить дорогу, навигацию, расписание и правила посещения по официальным источникам.',
  'Оставить маршрут и контакты близким; договориться о времени выхода на связь.',
  'Заложить резервный день и не покупать критичные стыковки вплотную к переправе.',
  'Взять многослойную одежду, непродуваемый верхний слой и удобную нескользящую обувь.',
  'Сохранить билеты, документы, адреса и карты в своих приложениях для работы без сети.',
  'Взять зарядное устройство, воду и индивидуальные лекарства; холод быстрее разряжает телефон.',
  'На удалённых маршрутах не выходить без подготовки и местного сопровождения.',
]

const memoText = `TRAVEL ARCTIC — ПАМЯТКА ПЕРЕД ПОЕЗДКОЙ НА СЕВЕР
Редакционная проверка: ${REVIEW_DATE}

ПЕРЕД ВЫЕЗДОМ
${checklist.map(item => `[ ] ${item}`).join('\n')}

НА МЕСТЕ
[ ] Повторно проверить погоду и транспорт перед каждым выездом.
[ ] Оставаться на открытых маршрутах и соблюдать указания местных специалистов.
[ ] Не приближаться к диким животным и не выходить на камни при сильном прибое.
[ ] Уносить мусор, не оставлять костров и не запускать дрон без проверки правил.
[ ] При ухудшении условий вернуться или отменить маршрут — это нормальное решение.

ЭКСТРЕННАЯ ПОМОЩЬ
Единый номер экстренных служб: 112.
Сообщите место, что произошло, число людей и состояние пострадавших.
Не предпринимайте действий, которые создают опасность для вас и спасателей.

ОФИЦИАЛЬНЫЕ ИСТОЧНИКИ
Гидрометцентр России: https://meteoinfo.ru/
МЧС России: https://mchs.gov.ru/
Мурманская область: https://murmansk.travel/
Музей-заповедник «Кижи»: https://kizhi.karelia.ru/
Соловецкий музей-заповедник: https://www.solovky.ru/
Национальный парк «Русская Арктика»: https://rus-arc.ru/

Памятка не заменяет инструктаж, правила конкретной территории и рекомендации перевозчика или экспедиционной команды.
Travel Arctic — некоммерческий редакционный путеводитель.`

declare global {
  interface Window {
    ym?: (counterId: number, method: string, goal: string, params?: Record<string, string>) => void
  }
}

function trackGoal(goal: string, params?: Record<string, string>) {
  if (typeof window.ym === 'function') window.ym(92093763, 'reachGoal', goal, params)
}

export default function App() {
  const [selectedId, setSelectedId] = useState<DestinationId>('kola')
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<DestinationId[]>([])
  const [quizComplete, setQuizComplete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const quizFocusRef = useRef<HTMLHeadingElement>(null)
  const active = destinations.find(item => item.id === selectedId) ?? destinations[0]
  const quizResult = destinations.find(item => item.id === getQuizResult(quizAnswers)) ?? destinations[0]

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!menuOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const dialog = menuRef.current
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])
    window.setTimeout(() => focusable()[0]?.focus(), 20)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
      if (event.key !== 'Tab') return
      const items = focusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      previousFocus?.focus()
    }
  }, [menuOpen])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const selectDestination = (id: DestinationId, shouldScroll = true) => {
    setSelectedId(id)
    trackGoal('destination_open', { destination: id })
    if (shouldScroll) window.setTimeout(() => scrollTo('guide'), 30)
  }

  const changeDestination = (direction: number) => {
    const activeIndex = destinations.findIndex(item => item.id === active.id)
    const nextIndex = (activeIndex + direction + destinations.length) % destinations.length
    selectDestination(destinations[nextIndex].id, false)
  }

  const focusQuizHeading = () => {
    window.setTimeout(() => quizFocusRef.current?.focus(), 30)
  }

  const answerQuiz = (destination: DestinationId) => {
    const nextAnswers = [...quizAnswers]
    nextAnswers[quizStep] = destination
    setQuizAnswers(nextAnswers)

    if (quizStep === 0 && quizAnswers.length === 0) trackGoal('quiz_start')

    if (quizStep === quizQuestions.length - 1) {
      setQuizComplete(true)
      trackGoal('quiz_complete', { destination: getQuizResult(nextAnswers) })
    } else {
      setQuizStep(step => step + 1)
    }
    focusQuizHeading()
  }

  const previousQuizQuestion = () => {
    if (quizComplete) {
      setQuizComplete(false)
      setQuizStep(quizQuestions.length - 1)
    } else {
      setQuizStep(step => Math.max(0, step - 1))
    }
    focusQuizHeading()
  }

  const restartQuiz = () => {
    setQuizAnswers([])
    setQuizStep(0)
    setQuizComplete(false)
    trackGoal('quiz_restart')
    focusQuizHeading()
  }

  const openQuizGuide = () => {
    trackGoal('quiz_guide_open', { destination: quizResult.id })
    selectDestination(quizResult.id)
  }

  const downloadMemo = () => {
    const blob = new Blob([memoText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'travel-arctic-pamyatka.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    trackGoal('memo_download')
    setNotice('Памятка скачана. Её можно читать без интернета.')
  }

  const printMemo = () => {
    trackGoal('memo_print')
    window.print()
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Перейти к содержанию</a>
      <header className="topbar">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Travel Arctic — наверх">
          <Compass size={25} strokeWidth={1.5} />
          <span>TRAVEL ARCTIC</span>
        </button>
        <nav className="desktop-nav" aria-label="Основная навигация">
          <button onClick={() => scrollTo('directions')}>Направления</button>
          <button onClick={() => scrollTo('quiz')}>Тест</button>
          <button onClick={() => scrollTo('guide')}>Путеводитель</button>
          <button onClick={() => scrollTo('prepare')}>Подготовка</button>
        </nav>
        <button className="nav-cta" onClick={() => scrollTo('memo')}>Памятка <FileText size={17} /></button>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню" aria-expanded={menuOpen}><Menu /></button>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero-image" src="./images/hero-teriberka.jpg" alt="Скалистый берег Баренцева моря в Териберке" loading="lazy" />
          <div className="hero-shade" />
          <div className="hero-content">
            <h1 id="hero-title">Арктика и<br />Русский Север</h1>
            <p className="hero-lead">Кольский полуостров, Кижи, Соловецкие острова и Земля Франца-Иосифа. Особенности мест, ориентиры для маршрута и подготовка к поездке.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => scrollTo('directions')}>Выбрать направление <ArrowRight size={20} /></button>
            </div>
          </div>
          <div className="hero-foot">
            <span>Териберка, Кольский полуостров</span>
          </div>
        </section>

        <section className="intro-section" id="directions">
          <div className="section-heading">
            <h2>Четыре направления</h2>
          </div>
          <div className="intro-copy">
            <p>От дороги к Баренцеву морю до высокоширотной экспедиции. Выбирайте не только пейзаж, но и формат путешествия, который вам подходит.</p>
            <p className="small-note">Сезон и длительность — ориентиры, а не расписание. Погоду, перевозки и правила посещения проверяйте перед каждой поездкой.</p>
          </div>
        </section>

        <section className="destination-grid" aria-label="Направления путешествий">
          {destinations.map((destination) => (
            <article className={`destination destination-${destination.id}`} key={destination.id}>
              <img src={destination.image} alt={destination.alt} loading="lazy" />
              <div className="destination-overlay" />
              <div className="destination-content">
                <p>{destination.region}</p>
                <h3>{destination.name}</h3>
                <span>{destination.note}</span>
                <div className="destination-meta"><span>{destination.season}</span><span>{destination.duration}</span></div>
                <button onClick={() => selectDestination(destination.id)} aria-label={`Открыть путеводитель: ${destination.name}`}>
                  Читать путеводитель <ArrowRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="quiz-section" id="quiz" aria-labelledby="quiz-title">
          <div className="quiz-heading">
            <div>
              <p className="quiz-kicker">Тест · 5 вопросов</p>
              <h2 id="quiz-title">Куда вам<br />на Север?</h2>
            </div>
            <p>Выберите близкие вам ответы. В конце — направление, которое подходит вашему темпу и ожиданиям, с объяснением и переходом к путеводителю.</p>
          </div>

          <div className="quiz-body">
            <div className="quiz-progress-copy">
              <span>{quizComplete ? 'Тест пройден' : `Вопрос ${quizStep + 1} из ${quizQuestions.length}`}</span>
              <span>{quizComplete ? quizQuestions.length : quizStep + 1} / {quizQuestions.length}</span>
            </div>
            <div
              className="quiz-progress"
              role="progressbar"
              aria-label="Прогресс теста"
              aria-valuemin={1}
              aria-valuemax={quizQuestions.length}
              aria-valuenow={quizComplete ? quizQuestions.length : quizStep + 1}
            >
              <span style={{ width: `${((quizComplete ? quizQuestions.length : quizStep + 1) / quizQuestions.length) * 100}%` }} />
            </div>

            {!quizComplete ? (
              <div className="quiz-question" key={quizStep}>
                <h3 ref={quizFocusRef} tabIndex={-1}>{quizQuestions[quizStep].question}</h3>
                <div className="quiz-options" role="group" aria-label="Варианты ответа">
                  {quizQuestions[quizStep].options.map((option, index) => (
                    <button
                      type="button"
                      key={option.label}
                      className={`quiz-option${quizAnswers[quizStep] === option.destination ? ' selected' : ''}`}
                      aria-pressed={quizAnswers[quizStep] === option.destination}
                      onClick={() => answerQuiz(option.destination)}
                    >
                      <span className="quiz-option-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <span>{option.label}</span>
                      <ArrowRight size={19} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <div className="quiz-controls">
                  <button type="button" className="quiz-back" onClick={previousQuizQuestion} disabled={quizStep === 0}>
                    <ArrowLeft size={17} />Назад
                  </button>
                  <span>Ответ можно изменить, вернувшись к вопросу.</span>
                </div>
              </div>
            ) : (
              <div className="quiz-result">
                <div className="quiz-result-visual">
                  <img src={quizResult.image} alt={quizResult.alt} />
                  <p>{quizResult.region}</p>
                </div>
                <div className="quiz-result-copy">
                  <p className="quiz-result-kicker">Ваш результат</p>
                  <h3 ref={quizFocusRef} tabIndex={-1}>{quizResult.name}</h3>
                  <p className="quiz-result-reason">{quizResultCopy[quizResult.id]}</p>
                  <div className="quiz-result-facts">
                    <span><CalendarDays size={17} />{quizResult.duration}</span>
                    <span><CloudSun size={17} />{quizResult.season}</span>
                  </div>
                  <div className="quiz-result-actions">
                    <button type="button" className="primary-button" onClick={openQuizGuide}>Открыть путеводитель <ArrowRight size={19} /></button>
                    <button type="button" className="secondary-button" onClick={restartQuiz}>Пройти ещё раз</button>
                  </div>
                  <button type="button" className="quiz-change-answer" onClick={previousQuizQuestion}><ArrowLeft size={16} />Изменить последний ответ</button>
                  <p className="quiz-result-note">Это ориентир по вашим ответам, а не оценка бюджета или физической подготовки. Перед поездкой проверьте условия посещения.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="guide-section" id="guide" aria-labelledby="guide-title">
          <div className="guide-header">
            <div>
              <h2 id="guide-title">Путеводитель</h2>
            </div>
            <p>Выберите направление: ниже — особенности места, ориентировочный план и ссылки на официальные источники.</p>
          </div>

          <div className="guide-switcher" role="group" aria-label="Выбрать направление">
            {destinations.map((destination) => (
              <button
                key={destination.id}
                aria-pressed={active.id === destination.id}
                className={active.id === destination.id ? 'active' : ''}
                onClick={() => selectDestination(destination.id, false)}
              >
                {destination.shortName}
              </button>
            ))}
          </div>

          {destinations.map((destination, index) => (
            <article
              className="destination-guide"
              id={`guide-${destination.id}`}
              aria-labelledby={`guide-title-${destination.id}`}
              hidden={active.id !== destination.id}
              key={destination.id}
            >
              <div className="guide-visual">
                <img src={destination.image} alt={destination.alt} loading="lazy" />
                <p>{destination.region}</p>
              </div>
              <div className="guide-overview">
                <div className="guide-facts">
                  <span><CalendarDays size={17} />{destination.duration}</span>
                  <span><CloudSun size={17} />{destination.season}</span>
                </div>
                <h3 id={`guide-title-${destination.id}`}>{destination.name}</h3>
                <p className="guide-lead">{destination.lead}</p>
                <p>{destination.description}</p>
              </div>

              <div className="guide-highlights">
                <h4>Что не пропустить</h4>
                <div className="highlight-grid">
                  {destination.highlights.map((item) => (
                    <section key={item.title}>
                      <h5>{item.title}</h5>
                      <p>{item.text}</p>
                    </section>
                  ))}
                </div>
              </div>

              <div className="guide-planning">
                <div className="plan-column">
                  <h4>Как строить поездку</h4>
                  <ol className="plan-list">
                    {destination.plan.map(item => (
                      <li key={item.title}>
                        <h5>{item.title}</h5>
                        <p>{item.text}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <aside className="caution-card">
                  <AlertTriangle size={25} />
                  <h4>Важно перед выездом</h4>
                  <p>{destination.caution}</p>
                  <div className="source-list">
                    <span>Проверить условия</span>
                    {destination.sources.map(source => (
                      <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackGoal('official_source', { source: source.label })}>
                        {source.label}<ExternalLink size={15} />
                      </a>
                    ))}
                  </div>
                </aside>
              </div>

              <div className="guide-pagination">
                <button onClick={() => changeDestination(-1)}><ArrowLeft size={17} />Предыдущее</button>
                <span>{String(index + 1).padStart(2, '0')} / {String(destinations.length).padStart(2, '0')}</span>
                <button onClick={() => changeDestination(1)}>Следующее<ArrowRight size={17} /></button>
              </div>
            </article>
          ))}
        </section>

        <section className="prepare-section" id="prepare">
          <div className="prepare-heading">
            <h2>Перед поездкой</h2>
            <p>На Севере гибкость — часть плана. Эти принципы остаются полезными независимо от сезона, цен и расписаний.</p>
          </div>
          <div className="principles-grid">
            <article><h3>Погода важнее списка мест</h3><p>Проверяйте не только температуру, но и ветер, осадки, видимость и предупреждения. Оставляйте запасной сценарий и день.</p></article>
            <article><h3>Условия — у первоисточника</h3><p>Дороги, навигацию, билеты, пропускной режим и правила посещения уточняйте у музея, парка, перевозчика или местной администрации.</p></article>
            <article><h3>Меньше следа, больше уважения</h3><p>Оставайтесь на разрешённых тропах, не приближайтесь к животным, уносите мусор и учитывайте интересы людей, которые живут рядом.</p></article>
          </div>
        </section>

        <section className="memo-section" id="memo">
          <div className="memo-intro">
            <h2>Памятка на дорогу</h2>
            <p>Восемь пунктов, которые стоит проверить перед выездом. Скачайте текстовый файл на телефон или распечатайте памятку.</p>
            <div className="memo-actions">
              <button className="primary-button" onClick={downloadMemo}><Download size={19} />Скачать .txt</button>
              <button className="secondary-button" onClick={printMemo}><Printer size={19} />Печать / PDF</button>
            </div>
            <p className="memo-note">Карты заранее скачайте в своём картографическом приложении. Памятка не заменяет инструктаж и правила конкретной территории.</p>
          </div>

          <article className="print-memo" id="print-memo">
            <header>
              <div><Compass size={24} /><strong>TRAVEL ARCTIC</strong></div>
              <span>Памятка перед поездкой</span>
            </header>
            <h3>Север начинается с подготовки</h3>
            <p className="print-review">Редакционная проверка: {REVIEW_DATE}</p>
            <ul>
              {checklist.map(item => <li key={item}><span aria-hidden="true" />{item}</li>)}
            </ul>
            <div className="memo-emergency">
              <Phone size={22} />
              <div><strong>Экстренная помощь · 112</strong><p>Назовите место, ситуацию, число людей и состояние пострадавших. Не создавайте дополнительную опасность для себя и спасателей.</p></div>
            </div>
            <footer>Памятка не заменяет инструктаж, правила территории и указания перевозчика или экспедиционной команды.</footer>
          </article>
        </section>

      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="brand footer-brand"><Compass size={25} /><span>TRAVEL ARCTIC</span></div>
          <p>Путеводитель по Арктике и Русскому Северу. Не туристический оператор и не сервис бронирования.</p>
          <button onClick={() => scrollTo('directions')}>К направлениям <ArrowRight size={16} /></button>
        </div>
        <div className="footer-bottom">
          <span>2026 год</span>
          <details>
            <summary>Фотографии и лицензии <ChevronRight size={15} /></summary>
            <div className="credits-list">
              <p>Фотографии кадрированы для сайта. Если оригинал недоступен во время сборки, используется архивная фотография проекта.</p>
              <a href="https://www.pexels.com/photo/teriberka-coast-russia-9740984/" target="_blank" rel="noopener noreferrer">Териберка · Sergei Gussev · Pexels License<ExternalLink size={13} /></a>
              <a href="https://commons.wikimedia.org/wiki/File:Kizhi_churches.jpg" target="_blank" rel="noopener noreferrer">Кижи · MatthiasKabel · CC BY-SA 3.0<ExternalLink size={13} /></a>
              <a href="https://commons.wikimedia.org/wiki/File:Solovetsky_Monastery_drone_1.jpg" target="_blank" rel="noopener noreferrer">Соловки · Trasprd · CC BY-SA 4.0<ExternalLink size={13} /></a>
              <a href="https://commons.wikimedia.org/wiki/File:Franz_Josef_Land_(18988581584).jpg" target="_blank" rel="noopener noreferrer">Земля Франца-Иосифа · Christopher Michel · CC BY 2.0<ExternalLink size={13} /></a>
            </div>
          </details>
          <span>Перед выездом проверьте погоду, транспорт и правила посещения по официальным источникам.</span>
        </div>
      </footer>

      {menuOpen && <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Меню" ref={menuRef}>
        <button className="modal-close" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню"><X /></button>
        <div className="brand"><Compass size={25} /><span>TRAVEL ARCTIC</span></div>
        <nav>
          <button onClick={() => scrollTo('directions')}>Направления <ArrowRight /></button>
          <button onClick={() => scrollTo('quiz')}>Тест <ArrowRight /></button>
          <button onClick={() => scrollTo('guide')}>Путеводитель <ArrowRight /></button>
          <button onClick={() => scrollTo('prepare')}>Подготовка <ArrowRight /></button>
          <button onClick={() => scrollTo('memo')}>Памятка <ArrowRight /></button>
        </nav>
        <button className="primary-button" onClick={() => scrollTo('memo')}>Открыть памятку <FileText size={18} /></button>
      </div>}

      {notice && <div className="toast" role="status"><Check size={18} />{notice}</div>}
    </div>
  )
}
