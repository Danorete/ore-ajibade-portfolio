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
    'B.B.A. in Computer Information Systems (Data Innovation) at Georgia State University · Former AI Intern @ BalanX Bio · 1st Place Microsoft AI Hackathon Winner.',
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
    company: 'GSU Career Services Center',
    role: 'Career Peer Educator',
    period: 'Jul 2026 – Present',
    location: 'Atlanta, GA',
    points: [
      'Educate students on the services the Career Services Center provides.',
      'Review student resumes and give feedback, and coach students on pitches and interviews.',
      'Meet with major and local employers to host campus events where students can apply and form personal connections.',
    ],
    tags: ['Career Coaching', 'Resume Review', 'Employer Relations'],
  },
  {
    company: 'BalanX Bio',
    role: 'AI Intern',
    period: 'Jul 2026 – Oct 2026',
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

export type Hackathon = {
  name: string
  event?: string
  role: string
  period: string
  location?: string
  result?: string
  points: string[]
  tags: string[]
  repoUrl?: string
  liveUrl?: string
  detailHref?: string
}

export const hackathons: Hackathon[] = [
  {
    name: 'The Piedmont Ledger',
    event: 'Microsoft × AIS GSU Data Dive, Cybersecurity track',
    role: 'Investigation lead, demo builder and presenter',
    period: 'Oct 27–28, 2026',
    result: 'Honorable Mention',
    points: [
      'Led a team investigation of a simulated ticketing-system breach using 1,400 log lines and 1,161 ticket records.',
      'Built and tested a behavior-based alert: 54 of 54 attacks caught with 0 false alarms on held-out data.',
      'Traced 630 fake tickets to a single compromised key and proposed a four-layer fix with a six-week rollout plan.',
    ],
    tags: [
      'Data analysis',
      'Visualization',
      'AI agent prompting',
      'Project management',
      'Cybersecurity',
    ],
    detailHref: '/projects/piedmont-ledger',
  },
  {
    name: 'PromptPath',
    event: 'VibeCoders Business Hackathon',
    role: 'Team Lead',
    period: 'Oct 2026',
    points: [
      'Led team VibeCoders in a business graded hackathon on building for people and organizations whose needs changed or went unmet because of AI.',
      'Took an idea rooted in secure prompting and vibe coding risks and pivoted after mentor feedback to PromptPath, a product that helps new hires understand large company datasets safely.',
      'Ran team meetings over Zoom, delegated work to the remaining members, and kept the project moving after teammates left.',
      'Worked on the demo and presentation and hosted the team\'s pitch practice.',
      'Represented the team in person at the event while teammates worked remotely.',
    ],
    tags: ['Team Leadership', 'Pitching', 'Delegation'],
  },
  {
    name: 'MaternalGrid',
    event: 'HackHers 2026 (Girls Who Code at GSU hackathon)',
    role: 'Data and Backend Lead',
    period: '2026',
    location: 'Atlanta, GA',
    result: 'Placed',
    points: [
      'Built MaternalGrid, a tool that simulates how maternity care access in Georgia changes when labor and delivery facilities open or close.',
      'Audited the dataset and built the travel time model and matrix behind the simulation.',
      'Designed the TigerData/Postgres schema and the Node/TypeScript API layer, developing with Claude Code.',
    ],
    tags: [
      'Postgres',
      'Node.js',
      'TypeScript',
      'Claude Code',
      'Travel Time Modeling',
    ],
  },
  {
    name: 'Microsoft x NSBE Agent-A-Thon',
    event: 'NSBE National Convention',
    role: 'Team member, concept and product thinking',
    period: '2026',
    location: 'Baltimore, MD',
    result: '1st Place',
    points: [
      'Contributed concept and product thinking for an AI agent built in Microsoft Copilot Studio.',
      'The solution used the Claude API, Databricks Genie for validation, and a Streamlit interface.',
      'The agent scored resumes from 1 to 100 and automated calendar scheduling for recruiters, built in a live 60 minute sprint.',
    ],
    tags: [
      'Copilot Studio',
      'Claude API',
      'Databricks Genie',
      'Streamlit',
      'Product Thinking',
      'Outlook API',
    ],
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
}

export const projects: Project[] = [
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
    title: 'AI Powered Python Study Tutor',
    blurb:
      "A study app I built after missing lectures before a quiz. It turns my professor's lecture transcripts into practice problems across the textbook chapters and uses Claude to coach students with Socratic feedback, with spaced repetition, exam simulation, and progress tracking.",
    tags: ['Python', 'JavaScript', 'Claude API', 'Spaced Repetition'],
    repoUrl: 'https://github.com/Danorete/Python-Study-Tutor',
    highlights: [
      { metric: '242', label: 'Practice Problems' },
      { metric: '16', label: 'Topics' },
      { metric: '3', label: 'Difficulty Levels' },
    ],
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
