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
}

export const projects: Project[] = [
  {
    title: 'Microsoft AI Hackathon Winner (Agent-A-Thon)',
    award: '1st Place',
    blurb:
      'Won 1st place in a live 60-minute sprint. Built an AI agent that scores resumes 1–100 and automates calendar scheduling for recruiters.',
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
  },
  {
    title: 'Customer Purchase Behavior Analysis & AI Dashboard',
    blurb:
      'Cleaned 1M+ transactions, identified the top 20% of customers driving 77.2% of revenue via RFM segmentation, automated refresh, and shipped a conversational AI query interface.',
    tags: [
      'Snowflake',
      'Streamlit',
      'Claude API',
      'Power BI',
      'RFM Segmentation',
      'Databricks Genie',
    ],
    highlights: [
      { metric: '1M+', label: 'Transactions Cleaned' },
      { metric: '77.2%', label: 'Revenue from Top 20%' },
      { metric: 'Auto', label: 'Refresh Pipeline' },
    ],
  },
  {
    title: 'AI-Powered RFM Customer Segmentation Dashboard',
    blurb:
      'Segmented 5,878 customers from 1M+ retail transactions, revealing that 77% of revenue comes from the top 20% of customers.',
    tags: ['Python', 'pandas', 'Streamlit', 'Claude API', 'Databricks'],
    liveUrl: 'https://ore-rfm-dashboard.streamlit.app/',
    repoUrl: 'https://github.com/Danorete/AI-RFM-Dashboard',
    highlights: [
      { metric: '5,878', label: 'Customers Segmented' },
      { metric: '77.2%', label: 'Revenue from Top 20%' },
      { metric: '1M+', label: 'Transaction Records' },
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
      'SQL',
      'Snowflake',
      'Databricks',
      'Power BI',
      'Tableau',
      'Streamlit',
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
