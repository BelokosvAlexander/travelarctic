import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  CloudSun,
  Compass,
  ExternalLink,
  Layers3,
  Menu,
  PackageCheck,
  Printer,
  Route,
  ShieldCheck,
  Waves,
  Wind,
  X,
} from 'lucide-react'
import './App.css'

type DestinationId = 'kola' | 'kizhi' | 'solovki' | 'franz'
type Season = 'winter' | 'summer' | 'expedition'
type QuizOption = {
  label: string
  scores: Partial<Record<DestinationId, number>>
}
type QuizQuestion = {
  question: string
  options: QuizOption[]
}

const YM_ID = 92093763
const REVIEW_DATE = '4 ноября 2026'

function trackGoal(goal: string, params: Record<string, string | number> = {}) {
  if (typeof window.ym === 'function') window.ym(YM_ID, 'reachGoal', goal, params)
}

const destinations = [
  {
    id: 'kola' as DestinationId,
    name: 'Кольский полуостров',
    region: 'Мурманская область · Баренцево море',
    duration: '3–5 дней',
    season: 'Сентябрь — апрель',
    number: '01',
    image: './images/hero-teriberka.jpg',
    alt: 'Снежные скалы и берег Баренцева моря в Териберке',
    lead: 'Северное сияние, тундра и холодное море — в поездке, которую удобно строить от Мурманска.',
    description: 'Это самый доступный формат знакомства с заполярной природой: можно остановиться в Мурманске или Териберке, чередовать поездки по побережью с прогулками по тундре и менять планы вслед за погодой.',
    highlights: [
      { title: 'Берег Териберки', text: 'Скалы, песчаная коса и выход к открытому Баренцеву морю. Закладывайте запас времени на дорогу и сильный ветер.' },
      { title: 'Охота за сиянием', text: 'Тёмное небо — лишь одно из условий. Нужны ещё подходящая геомагнитная активность и отсутствие плотной облачности.' },
      { title: 'Мурманск', text: 'Город удобен как база: здесь проще решить вопросы жилья, транспорта и запасного плана на непогоду.' },
    ],
    plan: [
      { title: 'Выберите базу', text: 'Мурманск подходит для вылазок, Териберка — для жизни рядом с морем. Не пытайтесь объять весь полуостров за одни выходные.' },
      { title: 'Оставьте окно по погоде', text: 'Зимой дорогу на побережье могут закрывать. Один резервный день полезнее плотного списка экскурсий.' },
      { title: 'Проверьте небо заранее', text: 'Смотрите прогноз облачности и геомагнитной активности, но не воспринимайте сияние как гарантированную часть программы.' },
    ],
    caution: 'Не выходите на лёд и прибрежные скалы при шторме. Для самостоятельных поездок зимой особенно важны состояние дороги, светлое время суток и связь.',
    sources: [
      { label: 'Дороги Мурманской области', url: 'https://murmansk.ru/' },
      { label: 'Прогноз сияния · ИZMIRAN', url: 'https://auroraforecast.izmiran.ru/' },
    ],
  },
  {
    id: 'kizhi' as DestinationId,
    name: 'Кижи и Онежское озеро',
    region: 'Карелия · Онежское озеро',
    duration: '2–3 дня',
    season: 'Май — сентябрь',
    number: '02',
    image: './images/kizhi.jpg',
    alt: 'Деревянные церкви музея-заповедника Кижи',
    lead: 'Деревянная архитектура и большая вода — спокойный маршрут с понятной логистикой из Петрозаводска.',
    description: 'Кижский погост стоит воспринимать не как отдельную фототочку, а как часть целого музейного острова. Здесь важны тихие прогулки, знакомство с северной деревней и внимание к деталям деревянных построек.',
    highlights: [
      { title: 'Кижский погост', text: 'Ансамбль церквей и колокольни — архитектурный центр острова и объект всемирного наследия ЮНЕСКО.' },
      { title: 'Сектора музея', text: 'Дома, часовни и хозяйственные постройки помогают увидеть, как была устроена жизнь северной деревни.' },
      { title: 'Онежское озеро', text: 'Переход по воде — самостоятельная часть впечатлений. Возьмите ветровку даже в тёплый день.' },
    ],
    plan: [
      { title: 'Начните с Петрозаводска', text: 'Сверьте актуальный способ добраться до острова и время возвращения перед покупкой остальных частей маршрута.' },
      { title: 'Оставьте острову день', text: 'Не ограничивайтесь главным ансамблем: музейная экспозиция и прогулка по острову требуют времени.' },
      { title: 'Добавьте материк', text: 'Если есть ещё день, используйте его для знакомства с Петрозаводском или природой Карелии, не перегружая основную поездку.' },
    ],
    caution: 'Расписание водного транспорта сезонное и зависит от погоды. Не стройте стыковку с поездом или самолётом вплотную к возвращению с острова.',
    sources: [
      { label: 'Музей-заповедник «Кижи»', url: 'https://kizhi.karelia.ru/' },
      { label: 'Официальная информация ЮНЕСКО', url: 'https://whc.unesco.org/en/list/544/' },
    ],
  },
  {
    id: 'solovki' as DestinationId,
    name: 'Соловецкие острова',
    region: 'Архангельская область · Белое море',
    duration: '3–4 дня',
    season: 'Июнь — сентябрь',
    number: '03',
    image: './images/solovki.jpg',
    alt: 'Соловецкий монастырь на берегу Белого моря',
    lead: 'Монастырь, северная природа и неторопливый островной ритм — маршрут для тех, кто готов к насыщенной истории.',
    description: 'На Соловках рядом существуют памятники разных эпох, монастырская жизнь и тяжёлая история лагерного периода. Лучше дать каждой теме время, а не сводить архипелаг к одной обзорной экскурсии.',
    highlights: [
      { title: 'Монастырский ансамбль', text: 'Крепостные стены, храмы и территория у бухты Благополучия формируют основу знакомства с островом.' },
      { title: 'История XX века', text: 'Музейные экспозиции и памятные места требуют бережного, внимательного посещения.' },
      { title: 'Природа архипелага', text: 'Пешие маршруты и виды Белого моря раскрывают остров за пределами центрального ансамбля.' },
    ],
    plan: [
      { title: 'Сверьте водное сообщение', text: 'Пассажирский сезон и рейсы меняются. Сначала проверьте официальную транспортную информацию, затем бронируйте жильё.' },
      { title: 'Разделите темы по дням', text: 'Один день — ансамбль, другой — музеи и память, третий — природа. Так поездка не превращается в непрерывную экскурсию.' },
      { title: 'Уточняйте правила посещения', text: 'Часть объектов принадлежит музею-заповеднику, часть связана с действующим монастырём. Режим посещения может различаться.' },
    ],
    caution: 'На Белом море возможны задержки рейсов из-за погоды. Оставляйте запас перед обратным поездом или самолётом и берите с собой лекарства, которые нужны регулярно.',
    sources: [
      { label: 'Соловецкий музей-заповедник', url: 'https://solovky.ru/' },
      { label: 'Туристический портал Архангельской области', url: 'https://pomorland.travel/' },
    ],
  },
  {
    id: 'franz' as DestinationId,
    name: 'Земля Франца-Иосифа',
    region: 'Высокоширотная Арктика · Северный Ледовитый океан',
    duration: 'Экспедиционный вояж',
    season: 'Арктическое лето',
    number: '04',
    image: './images/arctic-expedition.jpg',
    alt: 'Экспедиционное судно среди арктических льдов',
    lead: 'Ледяные пустыни и морская экспедиция — путешествие, которое планируют не как самостоятельную поездку выходного дня.',
    description: 'Архипелаг лежит в высоких широтах и входит в национальный парк «Русская Арктика». Посещение связано с экспедиционной логистикой, пограничными и природоохранными требованиями, а маршрут всегда подчинён ледовой и погодной обстановке.',
    highlights: [
      { title: 'Арктические ландшафты', text: 'Ледниковые купола, скалистые берега и дрейфующие льды определяют характер архипелага.' },
      { title: 'История полярных экспедиций', text: 'Сохранившиеся места стоянок и мемориальные объекты рассказывают о попытках освоения высоких широт.' },
      { title: 'Наблюдения за природой', text: 'Птицы и морские млекопитающие — часть экспедиции, но конкретные встречи и места высадок нельзя гарантировать.' },
    ],
    plan: [
      { title: 'Выбирайте организованный рейс', text: 'Самостоятельная туристическая поездка сюда не является обычным маршрутом. Изучайте программу лицензированного оператора и состав судна.' },
      { title: 'Читайте условия экспедиции', text: 'Уточните, какие высадки планируются, как принимаются решения по льду и что входит в стоимость.' },
      { title: 'Проверьте документы', text: 'Правила посещения пограничной зоны и особо охраняемой территории уточняются у организатора и в официальных источниках.' },
    ],
    caution: 'Программа экспедиции не является гарантией конкретных высадок. Капитан и экспедиционная команда меняют маршрут по соображениям безопасности и охраны природы.',
    sources: [
      { label: 'Национальный парк «Русская Арктика»', url: 'https://rus-arc.ru/' },
      { label: 'Росграница · официальная информация', url: 'https://ps.fsb.ru/' },
    ],
  },
]

const quizQuestions: QuizQuestion[] = [
  {
    question: 'Какая поездка вам ближе?',
    options: [
      { label: 'Побережье и поиск северного сияния', scores: { kola: 3, franz: 1 } },
      { label: 'Деревянная архитектура и острова', scores: { kizhi: 3, solovki: 1 } },
      { label: 'Монастыри и история Севера', scores: { solovki: 3, kizhi: 1 } },
      { label: 'Настоящая полярная экспедиция', scores: { franz: 3, kola: 1 } },
    ],
  },
  {
    question: 'Сколько времени вы готовы выделить?',
    options: [
      { label: 'Длинные выходные, 2–3 дня', scores: { kizhi: 3, solovki: 1 } },
      { label: '3–5 дней', scores: { kola: 3, solovki: 2 } },
      { label: 'Около недели', scores: { solovki: 2, kola: 1, kizhi: 1 } },
      { label: 'Полноценный отпуск ради экспедиции', scores: { franz: 3 } },
    ],
  },
  {
    question: 'Когда вы планируете путешествие?',
    options: [
      { label: 'Осенью или зимой', scores: { kola: 3 } },
      { label: 'Летом', scores: { kizhi: 2, solovki: 2, franz: 1, kola: 1 } },
      { label: 'Сезон не важен — выберу под место', scores: { kola: 1, kizhi: 1, solovki: 1, franz: 1 } },
    ],
  },
  {
    question: 'Какой уровень сложности вам подходит?',
    options: [
      { label: 'Простая логистика и короткий маршрут', scores: { kizhi: 3, kola: 1 } },
      { label: 'Несколько переездов и погодные сюрпризы', scores: { kola: 2, solovki: 2 } },
      { label: 'Морская экспедиция без гарантированных высадок', scores: { franz: 3 } },
    ],
  },
  {
    question: 'Что должно остаться в памяти после поездки?',
    options: [
      { label: 'Холодное море и полярное небо', scores: { kola: 3, franz: 1 } },
      { label: 'Тишина, вода и деревянные купола', scores: { kizhi: 3, solovki: 1 } },
      { label: 'Сильная история и островная жизнь', scores: { solovki: 3, kizhi: 1 } },
      { label: 'Лёд, судно и высокие широты', scores: { franz: 3 } },
    ],
  },
]

const essentials = [
  { icon: CalendarDays, title: 'Даты', text: 'Сезон навигации и режим работы музеев проверяются непосредственно перед поездкой.' },
  { icon: Layers3, title: 'Одежда', text: 'Слои, непромокаемая обувь и ветровка нужны даже летом: ветер на воде ощущается сильнее.' },
  { icon: ShieldCheck, title: 'Безопасность', text: 'Страховка, связь и запасной день важнее плотного расписания. Не рискуйте ради одной точки маршрута.' },
  { icon: Route, title: 'Транспорт', text: 'Не планируйте вплотную стыковки после морского перехода или зимней дороги в заполярных районах.' },
]

function getDestinationIdFromHash(): DestinationId {
  const match = window.location.hash.match(/^#guide-(kola|kizhi|solovki|franz)$/)
  return (match?.[1] as DestinationId | undefined) ?? 'kola'
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [season, setSeason] = useState<Season>('winter')
  const [activeId, setActiveId] = useState<DestinationId>(getDestinationIdFromHash)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<QuizOption[]>([])
  const [quizResult, setQuizResult] = useState<DestinationId | null>(null)
  const guideRefs = useRef<Record<string, HTMLElement | null>>({})
  const active = destinations.find(destination => destination.id === activeId) ?? destinations[0]
  const quizDestination = destinations.find(destination => destination.id === quizResult)

  useEffect(() => {
    const syncDestination = () => setActiveId(getDestinationIdFromHash())
    window.addEventListener('hashchange', syncDestination)
    return () => window.removeEventListener('hashchange', syncDestination)
  }, [])

  useEffect(() => {
    if (activeId !== 'kola') guideRefs.current[activeId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeId])

  const selectDestination = (id: DestinationId, scroll = true) => {
    setActiveId(id)
    trackGoal('destination_select', { destination: id })
    if (window.location.hash !== `#guide-${id}`) window.history.pushState(null, '', `#guide-${id}`)
    if (scroll) guideRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const changeDestination = (direction: number) => {
    const activeIndex = destinations.findIndex(item => item.id === active.id)
    const nextIndex = (activeIndex + direction + destinations.length) % destinations.length
    selectDestination(destinations[nextIndex].id, false)
  }

  const openPrintGuide = () => {
    trackGoal('print_guide')
    window.print()
  }

  const downloadGuide = () => {
    const text = [
      'TRAVEL ARCTIC — КРАТКАЯ ПАМЯТКА',
      `Редакция: ${REVIEW_DATE}`,
      '',
      ...destinations.flatMap(destination => [
        `${destination.number}. ${destination.name.toUpperCase()}`,
        destination.lead,
        `Срок: ${destination.duration}. Сезон: ${destination.season}.`,
        ...destination.plan.map((item, index) => `${index + 1}. ${item.title}: ${item.text}`),
        `Важно: ${destination.caution}`,
        `Проверить: ${destination.sources.map(source => source.url).join(' | ')}`,
        '',
      ]),
      'Перед выездом проверьте расписание, погоду, правила посещения и состояние дорог по официальным источникам.',
      'Материал не заменяет инструкции перевозчиков, музеев, операторов экспедиций и спасательных служб.',
    ].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'travel-arctic-pamyatka.txt'
    anchor.click()
    URL.revokeObjectURL(url)
    trackGoal('download_guide', { format: 'txt' })
  }

  const chooseQuizOption = (option: QuizOption) => {
    const answers = [...quizAnswers, option]
    if (quizStep < quizQuestions.length - 1) {
      setQuizAnswers(answers)
      setQuizStep(step => step + 1)
      return
    }

    const totals = destinations.reduce<Record<DestinationId, number>>((scores, destination) => {
      scores[destination.id] = answers.reduce((total, answer) => total + (answer.scores[destination.id] ?? 0), 0)
      return scores
    }, { kola: 0, kizhi: 0, solovki: 0, franz: 0 })
    const result = destinations.reduce((best, destination) => totals[destination.id] > totals[best.id] ? destination : best, destinations[0])
    setQuizAnswers(answers)
    setQuizResult(result.id)
    trackGoal('quiz_complete', { destination: result.id })
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setQuizAnswers([])
    setQuizResult(null)
  }

  const backQuiz = () => {
    if (quizStep === 0) return
    setQuizAnswers(answers => answers.slice(0, -1))
    setQuizStep(step => step - 1)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#guide">Перейти к путеводителю</a>
      <header className="site-header">
        <a href="#top" className="brand" onClick={closeMenu} aria-label="Travel Arctic — на главную">
          <svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 2L24.2 15.8L38 20L24.2 24.2L20 38L15.8 24.2L2 20L15.8 15.8L20 2Z" stroke="currentColor" strokeWidth="1.7" />
            <path d="M20 9V31M9 20H31" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span>travel arctic<span className="brand-sub">путеводитель по северу</span></span>
        </a>
        <button className="mobile-menu" type="button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Основная навигация">
          <a href="#directions" onClick={closeMenu}>Направления</a>
          <a href="#guide" onClick={closeMenu}>Путеводитель</a>
          <a href="#seasons" onClick={closeMenu}>Когда ехать</a>
          <a href="#essentials" onClick={closeMenu}>Перед поездкой</a>
          <a href="#quiz" className="nav-quiz" onClick={closeMenu}>Подобрать маршрут</a>
          <button type="button" className="nav-download" onClick={() => { closeMenu(); downloadGuide() }}><ArrowDown size={15} />Памятка</button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-image" role="img" aria-label="Берег Баренцева моря зимой" />
          <div className="hero-content">
            <div className="hero-kicker"><span />АРКТИКА И РУССКИЙ СЕВЕР</div>
            <h1>Дальше,<br />чем <em>север.</em></h1>
            <p>Четыре путешествия к морю, островам и ледяным широтам. Без обещаний идеальной погоды — с понятной подготовкой и уважением к месту.</p>
            <a className="primary-link" href="#directions">Выбрать направление<ArrowDown size={17} /></a>
          </div>
          <div className="hero-meta">
            <div><span className="meta-label">КУДА</span><strong>4 направления</strong></div>
            <div><span className="meta-label">ФОРМАТ</span><strong>Маршруты и советы</strong></div>
            <div className="hero-scroll"><ArrowDown size={17} /><span>ЛИСТАЙТЕ ВНИЗ</span></div>
          </div>
        </section>

        <section className="intro content-width">
          <div className="section-index">01 / НАЧНИТЕ ЗДЕСЬ</div>
          <div className="intro-body">
            <h2>Север начинается<br />не с чемодана.</h2>
            <div className="intro-copy">
              <p>Он начинается с вопросов: когда открыта навигация, где искать сияние, сколько дней оставить на дорогу и что делать, если погода изменила планы.</p>
              <p>Мы собрали четыре разных маршрута — от доступной поездки в Териберку до экспедиции на Землю Франца-Иосифа. Выберите своё направление и подготовьтесь без лишней суеты.</p>
            </div>
          </div>
        </section>

        <section className="directions content-width" id="directions">
          <div className="section-heading">
            <div><div className="section-index">02 / НАПРАВЛЕНИЯ</div><h2>Четыре истории Севера</h2></div>
            <p>От короткого путешествия<br />до полярной экспедиции.</p>
          </div>
          <div className="destination-list">
            {destinations.map(destination => (
              <button
                className={`destination-row ${activeId === destination.id ? 'is-active' : ''}`}
                key={destination.id}
                type="button"
                onClick={() => selectDestination(destination.id)}
                aria-label={`Открыть путеводитель: ${destination.name}`}
              >
                <span className="destination-number">{destination.number}</span>
                <span className="destination-photo"><img src={destination.image} alt="" loading="lazy" /></span>
                <span className="destination-title"><strong>{destination.name}</strong><small>{destination.region}</small></span>
                <span className="destination-season"><small>ЛУЧШЕЕ ВРЕМЯ</small>{destination.season}</span>
                <span className="destination-duration"><small>ДЛИТЕЛЬНОСТЬ</small>{destination.duration}</span>
                <span className="destination-arrow"><ArrowUpRight size={24} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="quiz-section" id="quiz">
          <div className="content-width quiz-layout">
            <div className="quiz-intro">
              <div className="section-index">03 / ПОДБОР МАРШРУТА</div>
              <Compass size={39} strokeWidth={1.2} />
              <h2>Какой Север — ваш?</h2>
              <p>Ответьте на пять коротких вопросов. Тест сопоставит ваши ожидания, время и готовность к сложной логистике с четырьмя направлениями.</p>
              <span>Около одной минуты · без регистрации</span>
            </div>
            <div className="quiz-card" aria-live="polite">
              {quizDestination ? (
                <div className="quiz-result">
                  <div className="quiz-result-top"><span>ВАШЕ НАПРАВЛЕНИЕ</span><CheckCircle2 size={29} /></div>
                  <div className="quiz-result-number">{quizDestination.number}</div>
                  <h3>{quizDestination.name}</h3>
                  <p className="quiz-result-region">{quizDestination.region}</p>
                  <p>{quizDestination.lead}</p>
                  <div className="quiz-result-facts"><span>{quizDestination.duration}</span><span>{quizDestination.season}</span></div>
                  <button type="button" className="quiz-main-button" onClick={() => selectDestination(quizDestination.id)}>Открыть путеводитель<ArrowRight size={17} /></button>
                  <button type="button" className="quiz-restart" onClick={resetQuiz}>Пройти тест заново</button>
                </div>
              ) : (
                <div className="quiz-question">
                  <div className="quiz-progress-head"><span>ВОПРОС {String(quizStep + 1).padStart(2, '0')} / {String(quizQuestions.length).padStart(2, '0')}</span>{quizStep > 0 && <button type="button" onClick={backQuiz}><ArrowLeft size={14} />Назад</button>}</div>
                  <div className="quiz-progress" role="progressbar" aria-label="Прогресс теста" aria-valuemin={1} aria-valuemax={quizQuestions.length} aria-valuenow={quizStep + 1}>
                    {quizQuestions.map((_, index) => <span className={index <= quizStep ? 'is-filled' : ''} key={index} />)}
                  </div>
                  <h3>{quizQuestions[quizStep].question}</h3>
                  <div className="quiz-options">
                    {quizQuestions[quizStep].options.map(option => <button type="button" key={option.label} onClick={() => chooseQuizOption(option)}>{option.label}<ArrowRight size={16} /></button>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="guide-section" id="guide">
          <div className="content-width">
            <div className="guide-topline"><div className="section-index">04 / ВАШ ПУТЕВОДИТЕЛЬ</div><span>ПРОВЕРЕНО {REVIEW_DATE.toUpperCase()}</span></div>
            <div className="destination-tabs" role="tablist" aria-label="Выбор путеводителя">
              {destinations.map(destination => (
                <button
                  key={destination.id}
                  type="button"
                  role="tab"
                  aria-selected={activeId === destination.id}
                  aria-controls={`guide-${destination.id}`}
                  className={activeId === destination.id ? 'is-selected' : ''}
                  onClick={() => selectDestination(destination.id, false)}
                >{destination.name}</button>
              ))}
            </div>

            {destinations.map((destination, index) => (
              <article
                className="destination-guide"
                id={`guide-${destination.id}`}
                ref={element => { guideRefs.current[destination.id] = element }}
                aria-labelledby={`guide-title-${destination.id}`}
                hidden={active.id !== destination.id}
                key={destination.id}
              >
                <div className="guide-visual"><img src={destination.image} alt={destination.alt} loading="lazy" /><p>{destination.region}</p></div>
                <div className="guide-overview">
                  <div className="guide-facts"><span><CalendarDays size={17} />{destination.duration}</span><span><CloudSun size={17} />{destination.season}</span></div>
                  <h3 id={`guide-title-${destination.id}`}>{destination.name}</h3>
                  <p className="guide-lead">{destination.lead}</p>
                  <p>{destination.description}</p>
                </div>

                <div className="guide-highlights">
                  <h4>Что не пропустить</h4>
                  <div className="highlight-grid">
                    {destination.highlights.map(item => <section key={item.title}><h5>{item.title}</h5><p>{item.text}</p></section>)}
                  </div>
                </div>

                <div className="guide-planning">
                  <div className="plan-column">
                    <h4>Как строить поездку</h4>
                    <ol className="plan-list">
                      {destination.plan.map(item => <li key={item.title}><h5>{item.title}</h5><p>{item.text}</p></li>)}
                    </ol>
                  </div>
                  <aside className="caution-card">
                    <Wind size={25} />
                    <h4>Важно перед выездом</h4>
                    <p>{destination.caution}</p>
                    <div className="source-list"><span>Проверить условия</span>{destination.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackGoal('official_source', { source: source.label })}>{source.label}<ExternalLink size={15} /></a>)}</div>
                  </aside>
                </div>

                <div className="guide-pagination">
                  <button type="button" onClick={() => changeDestination(-1)}><ArrowLeft size={17} />Предыдущее</button>
                  <span>{String(index + 1).padStart(2, '0')} / {String(destinations.length).padStart(2, '0')}</span>
                  <button type="button" onClick={() => changeDestination(1)}>Следующее<ArrowRight size={17} /></button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="seasons content-width" id="seasons">
          <div className="section-heading season-heading">
            <div><div className="section-index">05 / КАЛЕНДАРЬ</div><h2>У Севера свой ритм</h2></div>
            <div className="season-tabs" role="tablist" aria-label="Выбор сезона">
              <button type="button" role="tab" aria-selected={season === 'winter'} className={season === 'winter' ? 'is-selected' : ''} onClick={() => setSeason('winter')}>Зима и сияние</button>
              <button type="button" role="tab" aria-selected={season === 'summer'} className={season === 'summer' ? 'is-selected' : ''} onClick={() => setSeason('summer')}>Лето и навигация</button>
              <button type="button" role="tab" aria-selected={season === 'expedition'} className={season === 'expedition' ? 'is-selected' : ''} onClick={() => setSeason('expedition')}>Экспедиции</button>
            </div>
          </div>
          <div className="season-panel" role="tabpanel">
            <div className="season-symbol">{season === 'winter' ? <Compass size={43} strokeWidth={1} /> : season === 'summer' ? <Waves size={43} strokeWidth={1} /> : <Route size={43} strokeWidth={1} />}</div>
            <div>
              <span className="season-eyebrow">{season === 'winter' ? 'СЕНТЯБРЬ — МАРТ' : season === 'summer' ? 'ИЮНЬ — СЕНТЯБРЬ' : 'АРКТИЧЕСКОЕ ЛЕТО'}</span>
              <h3>{season === 'winter' ? 'Тёмное небо — не единственное условие' : season === 'summer' ? 'Вода открывает дорогу к островам' : 'Маршрут определяют лёд и погода'}</h3>
            </div>
            <p>{season === 'winter' ? 'Для северного сияния нужны тёмное небо, ясная погода и геомагнитная активность. Сентябрь и март обычно дают больше светлого времени для дневных поездок, а середина зимы — полярную ночь и суровые дороги.' : season === 'summer' ? 'Пассажирская навигация к Кижам и Соловкам сезонная. Июль и август популярны, но тёплой погоды они не гарантируют. Начало и конец сезона требуют особенно внимательной проверки расписаний.' : 'Короткий навигационный период не означает фиксированное расписание. Ледовая обстановка, возможности судна и правила посещения важнее заранее составленного списка высадок.'}</p>
          </div>
          <div className="season-note"><CloudSun size={18} /><p>Здесь указаны ориентиры, а не обещание погоды. Актуальный прогноз и условия поездки проверяйте перед выездом.</p></div>
        </section>

        <section className="essentials" id="essentials">
          <div className="content-width">
            <div className="section-index">06 / ПЕРЕД ПОЕЗДКОЙ</div>
            <div className="essentials-title"><h2>Меньше списков.<br />Больше понимания.</h2><p>Четыре вещи, которые стоит продумать<br />для любого северного маршрута.</p></div>
            <div className="essentials-grid">
              {essentials.map(item => { const Icon = item.icon; return <article key={item.title}><Icon size={25} strokeWidth={1.35} /><h3>{item.title}</h3><p>{item.text}</p></article> })}
            </div>
            <div className="download-panel">
              <div><PackageCheck size={34} strokeWidth={1.25} /><span><strong>Сохраните главное офлайн</strong><p>Маршруты, предупреждения и ссылки на официальные источники — в одной текстовой памятке.</p></span></div>
              <div className="download-actions"><button type="button" className="light-button" onClick={downloadGuide}><ArrowDown size={17} />Скачать .TXT</button><button type="button" className="outline-light-button" onClick={openPrintGuide}><Printer size={17} />Печать / PDF</button></div>
            </div>
          </div>
        </section>

        <section className="field-note content-width">
          <BookOpen size={30} strokeWidth={1.2} />
          <blockquote>«Хороший маршрут по Северу — не тот, где выполнены все пункты, а тот, где хватило внимания месту и уважения к погоде».</blockquote>
          <p>Принцип этого путеводителя</p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top content-width">
          <div className="footer-brand"><div className="brand"><svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 2L24.2 15.8L38 20L24.2 24.2L20 38L15.8 24.2L2 20L15.8 15.8L20 2Z" stroke="currentColor" strokeWidth="1.7" /><path d="M20 9V31M9 20H31" stroke="currentColor" strokeWidth="1.2" /></svg><span>travel arctic<span className="brand-sub">путеводитель по северу</span></span></div><p>Самостоятельный некоммерческий путеводитель.<br />Без продажи туров и навязанных маршрутов.</p></div>
          <div className="footer-links"><span>НАВИГАЦИЯ</span><a href="#directions">Направления</a><a href="#guide">Путеводитель</a><a href="#seasons">Когда ехать</a><a href="#essentials">Перед поездкой</a></div>
          <div className="footer-links"><span>МАТЕРИАЛЫ</span><button type="button" onClick={downloadGuide}>Скачать памятку</button><button type="button" onClick={openPrintGuide}>Печать / PDF</button><a href="https://github.com/BelokosvAlexander/travelarctic" target="_blank" rel="noopener noreferrer">Исходный код<ExternalLink size={13} /></a><a href="https://miro.com/app/board/uXjVERlrA_g=/" target="_blank" rel="noopener noreferrer">Карта проекта<ExternalLink size={13} /></a></div>
        </div>
        <div className="footer-bottom content-width"><span>2026 год</span><span>Проверяйте условия поездки по официальным источникам</span><a href="#top">Наверх<ArrowUpRight size={15} /></a></div>
      </footer>
    </div>
  )
}

export default App
