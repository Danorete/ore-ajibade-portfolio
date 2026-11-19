export const profile = {
  name: 'Ore Ajibade',
  role: 'AI & Data Analytics',
  location: 'Atlanta, GA',
  email: 'danorete@gmail.com',
  phone: '(470) 269-3298',
  phoneHref: 'tel:+14702693298',
  github: 'https://github.com/danorete',
  linkedin: 'https://www.linkedin.com/in/ore-ajibade',
  status: 'Seeking Fall 2026 / 2027 AI & Data Engineering Opportunities',
  headline: 'Bridging Data Analytics, Graph RAG & Intelligent AI Systems',
  subtitle:
    'B.B.A. in Computer Information Systems (Data Innovation) at Georgia State University · AI Intern @ BalanX Bio · 1st Place Microsoft AI Hackathon Winner.',
}

export const heroStats = [
  { label: '1st Place @ Microsoft Hackathon', metric: '1st', icon: 'trophy' },
  { label: 'Records Analyzed', metric: '1M+', icon: 'database' },
  { label: 'Graph RAG & Neo4j', metric: 'RAG', icon: 'graph' },
  { label: 'PL-300 & AZ-900 Certified', metric: '2×', icon: 'badge' },
] as const

export type Experience = {
  company: string
  role: string
  period: string
  location: string
  points: string[]
  tags: string[]
}

export const experiences: Experience[] = [
  {
    company: 'BalanX Bio',
    role: 'AI Intern',
    period: 'Jul 2026 – Present',
    location: 'Atlanta, GA',
    points: [
      'Building an AI Health Digital Twin proof-of-concept to model individual health trajectories.',
      'Engineered a Graph-based RAG pipeline with Neo4j for contextual retrieval over health knowledge.',
      'Developed a Python (pandas / NumPy) synthetic Apple HealthKit pipeline aligned to CDC NHANES / WHO standards.',
      'Authored a Claude Code technical knowledge base to accelerate team onboarding and documentation.',
    ],
    tags: ['Graph RAG', 'Neo4j', 'Python', 'Claude Code', 'HealthKit'],
  },
  {
    company: 'The Coca-Cola Company',
    role: 'Sales Representative',
    period: 'May 2025 – Jun 2026',
    location: 'Atlanta, GA',
    points: [
      'Ranked in the top 5% of associates by weekly revenue across 500+ daily customer interactions, driving 10% YoY growth.',
      'Optimized data-driven ordering with handheld inventory tech, reducing out-of-stocks by 25%.',
      'Maintained 0.5% transaction variance on $1M+ in monthly volume and mentored new associates.',
    ],
    tags: ['Analytics', 'Inventory Optimization', 'Financial Metrics'],
  },
  {
    company: 'Association for Information Systems',
    role: 'Student Ambassador',
    period: 'Aug 2024 – May 2026',
    location: 'Georgia State University',
    points: [
      'Coordinated recruiter networking panels connecting students with industry professionals.',
      'Facilitated technical workshops on data and information systems tooling.',
      'Managed student membership data and event analytics.',
    ],
    tags: ['Leadership', 'Networking', 'Data Management'],
  },
  {
    company: 'eXcelerate Computer Training School',
    role: 'Data Analytics Trainee',
    period: 'Aug 2024 – Nov 2024',
    location: 'Remote',
    points: [
      'Wrote multi-join SQL queries against financial and credit-card datasets.',
      'Performed exploratory data analysis (EDA) to surface transaction patterns and anomalies.',
    ],
    tags: ['SQL', 'EDA', 'Financial Data'],
  },
]

export type Project = {
  title: string
  blurb: string
  tags: string[]
  highlights: { metric: string; label: string }[]
  award?: string
  liveUrl?: string
  repoUrl?: string
  detailHref?: string
  thumbnail?: string
  thumbnailAlt?: string
  video?: { mp4: string; poster: string; caption: string }
}

export const projects: Project[] = [
  {
    title: 'The Piedmont Ledger',
    award: '2nd Place',
    blurb:
      'A team investigation of a simulated ticketing-system breach, with a tested alert and a six-week plan',
    tags: [
      'Data analysis',
      'Visualization',
      'AI agent prompting',
      'Project management',
      'Cybersecurity',
    ],
    highlights: [
      { metric: '54/54', label: 'Attacks Caught' },
      { metric: '0', label: 'False Alarms' },
      { metric: '630', label: 'Fake Tickets Traced' },
    ],
    detailHref: '/projects/piedmont-ledger',
    thumbnailAlt:
      'Timeline slide with labelled callout boxes marking the three nights of unauthorized visits',
  },
  {
    title: 'Microsoft AI Hackathon Winner (Agent-A-Thon)',
    award: '1st Place',
    blurb:
      'Won 1st place in a live 60-minute sprint. Built an AI agent that scores resumes 1–100 and automates calendar scheduling for recruiters. The prize included a Microsoft Surface Pro 12-inch.',
    tags: [
      'Microsoft Copilot Studio',
      'AI Agents',
      'Python',
      'Outlook API',
      'NSBE',
    ],
    highlights: [
      { metric: '1st', label: 'Place Winner' },
      { metric: '60 min', label: 'Live Sprint' },
      { metric: '1–100', label: 'Resume Scoring' },
    ],
    thumbnail: '/projects/agent-a-thon/winners-group.jpg',
    thumbnailAlt:
      'Group photo from the Microsoft x NSBE Agent-A-Thon, with attendees holding prize tote bags on stage',
  },
  {
    title: 'AI-Powered RFM Customer Segmentation Dashboard',
    blurb:
      'Segmented 5,878 customers from 1M+ Online Retail II transactions with RFM scoring, then turned the segments into a decision memo: protect the 2,530 Champions and Loyal Customers behind 84.7% of revenue, and win back the 683 Can\'t Lose Them and At Risk customers behind $1.66M in past spend. A Streamlit dashboard serves the synced segment table, and a Claude summary drafts plain language actions per segment from segment counts.',
    tags: ['Python', 'pandas', 'Streamlit', 'Claude API', 'RFM Segmentation'],
    liveUrl: 'https://ore-rfm-dashboard.streamlit.app/',
    repoUrl: 'https://github.com/Danorete/AI-RFM-Dashboard',
    highlights: [
      { metric: '5,878', label: 'Customers Segmented' },
      { metric: '77.2%', label: 'Revenue from Top 20%' },
      { metric: '1M+', label: 'Transaction Records' },
    ],
  },
  {
    title: 'What My Skips Say About How I Listen',
    blurb:
      'A Tableau Public dashboard built from a full year of my own Spotify history (Nov 2025 to Nov 2026). Cleaned and validated in Python, then used to ask when I explore and when I settle in: I skip 47% of streams overall, but only about 26% between midnight and 5 AM versus about 54% from 10 AM to 6 PM.',
    tags: ['Tableau', 'Python', 'pandas', 'Data Validation', 'Data Storytelling'],
    liveUrl:
      'https://public.tableau.com/views/Book1_17941744917780/Dashboard1?:language=en-US&:display_count=n',
    repoUrl: 'https://github.com/Danorete/spotify-listening-bi',
    highlights: [
      { metric: '87,748', label: 'Streams Analyzed' },
      { metric: '2,071', label: 'Hours Listened' },
      { metric: '47%', label: 'Streams Skipped' },
    ],
    thumbnail: '/projects/spotify-listening-bi/overview.png',
    thumbnailAlt:
      'Overview page of the Spotify listening dashboard showing the 47% skip rate, daytime versus overnight comparison, skip rate by hour and monthly listening hours',
    video: {
      mp4: '/projects/spotify-listening-bi/skips-demo.mp4',
      poster: '/projects/spotify-listening-bi/skips-demo-poster.jpg',
      caption:
        'A 28-second walkthrough: I skip almost half of what I play, and it depends on the time of day.',
    },
  },
  {
    title: 'MaternalGrid',
    blurb:
      'Built at HackHers 2026 (HealthHER track). A planning tool that shows health planners where Georgia women live too far from labor and delivery care, and lets them simulate closing or opening a delivering hospital to see how access changes. Travel times are modeled, not routed drive times.',
    tags: ['Streamlit', 'Python', 'PostGIS', 'TypeScript', 'Geospatial Analysis'],
    repoUrl: 'https://github.com/Danorete/maternalgrid',
    highlights: [
      { metric: '159', label: 'Georgia Counties' },
      { metric: '74', label: 'Counties Beyond 30 Min' },
      { metric: '70', label: 'Maternity Care Deserts' },
    ],
  },
  {
    title: 'Resume Extraction Field Notes',
    blurb:
      'A reproducible benchmark of four AI models extracting structured data from resumes, scored against a hand-written answer key with blind peer judging. Three of four models passed every resume; speed and output size, not accuracy, separated them.',
    tags: ['Python', 'LLM Evaluation', 'Prompt Engineering', 'Streamlit', 'Benchmarking'],
    highlights: [
      { metric: '48', label: 'Extractions Scored' },
      { metric: '192', label: 'Blind Judgments' },
      { metric: '3 of 4', label: 'Models Passed All' },
    ],
    thumbnail: '/projects/llm-judge-experiment/dashboard.png',
    thumbnailAlt:
      'Streamlit dashboard comparing model accuracy, latency and token use across resume extraction runs',
  },
  {
    title: 'PromptPath Onboarding Copilot',
    blurb:
      'Built at HackATL 2026, where I led the team. An onboarding assistant that maps an unfamiliar dataset for a new hire, strips sensitive values from questions before they reach a model, and cites the table and column behind every answer. Built in one day after a Saturday pivot.',
    tags: ['Streamlit', 'Claude API', 'Python', 'Data Privacy', 'Team Leadership'],
    highlights: [
      { metric: '1 day', label: 'Build Time' },
      { metric: '16', label: 'Automated Tests' },
      { metric: '0', label: 'Accessibility Violations' },
    ],
    thumbnail: '/projects/onboarding-copilot/ask-answer.png',
    thumbnailAlt:
      'Onboarding Copilot answering a question with cited table and column sources open',
  },
]

export type SkillCategory = {
  name: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'AI Development & Engineering',
    skills: [
      'Graph RAG',
      'Neo4j',
      'Claude Code',
      'Cursor',
      'Claude API',
      'OpenAI API',
      'Ollama',
      'LM Studio',
      'Prompt Engineering',
      'Agent Development',
    ],
  },
  {
    name: 'Technical Tools & Platforms',
    skills: [
      'Python (Pandas, NumPy)',
      'Excel / CSV',
      'SQL',
      'Snowflake',
      'Databricks',
      'Power BI',
      'Tableau',
      'Streamlit',
      'HTML / CSS / JavaScript',
      'GSAP animation',
      'Playwright for browser testing',
      'Git / GitHub',
      'Microsoft Azure',
    ],
  },
  {
    name: 'Analytics & Strategy',
    skills: [
      'RFM Segmentation',
      'Descriptive Statistics',
      'Gap Analysis',
      'Technical Documentation',
      'Financial Metrics (ROI, Margins)',
      'Project Management',
      'Cybersecurity',
      'Data analysis and visualization',
      'AI agent prompting',
    ],
  },
  {
    name: 'Certifications',
    skills: [
      'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
      'Microsoft Certified: Azure Fundamentals (AZ-900)',
      'eXcelerate SQL Boot Camp',
    ],
  },
]

export const education = {
  school: 'Georgia State University',
  degree: 'B.B.A. in Computer Information Systems (Data Innovation / Analytics)',
  expected: 'Expected May 2027',
  honors: [
    'Starks Scholarship — Full Tuition Merit Award',
    "Dean's List — Summer 2024, Spring 2025",
  ],
  coursework: [
    'Elementary Statistics',
    'Computer Science I & II',
    'Business Analysis',
    'Corporation Finance',
    'Micro & Macroeconomics',
    'Marketing Management',
  ],
}

export type Hobby = {
  name: string
  icon:
    | 'gaming'
    | 'anime'
    | 'thrifting'
    | 'journaling'
    | 'photography'
    | 'skateboarding'
    | 'gym'
    | 'nature'
  blurb: string
}

export const hobbies: Hobby[] = [
  {
    name: 'Gaming',
    icon: 'gaming',
    blurb: 'Late-night ranked runs and the occasional lore rabbit hole.',
  },
  {
    name: 'Anime',
    icon: 'anime',
    blurb: 'Shonen classics to slow-burn slice-of-life — always a new watchlist.',
  },
  {
    name: 'Thrifting',
    icon: 'thrifting',
    blurb: 'Hunting racks for one-of-one fits and vintage steals.',
  },
  {
    name: 'Journaling',
    icon: 'journaling',
    blurb: 'Pages of ideas, goals, and the occasional messy first draft.',
  },
  {
    name: 'Photography',
    icon: 'photography',
    blurb: 'Chasing golden hour and framing the ordinary in new ways.',
  },
  {
    name: 'Skateboarding',
    icon: 'skateboarding',
    blurb: 'Learning tricks the hard way — bruises are part of the process.',
  },
  {
    name: 'Gym',
    icon: 'gym',
    blurb: 'Progressive overload and the discipline that carries into work.',
  },
  {
    name: 'Nature',
    icon: 'nature',
    blurb: 'Trails, fresh air, and unplugging to reset the brain.',
  },
]
