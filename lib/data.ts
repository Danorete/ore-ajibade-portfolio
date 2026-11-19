export const profile = {
  name: 'Ore Ajibade',
  role: 'AI & Data Analytics',
  location: 'Atlanta, GA',
  email: 'danorete@gmail.com',
  phone: '(470) 269-3298',
  phoneHref: 'tel:+14702693298',
  github: 'https://github.com/danorete',
  linkedin: 'https://www.linkedin.com/in/ore-ajibade',
  status:
    'Seeking Summer 2027 analytics internships and Fall 2026 / 2027 AI & data engineering roles',
  headline: 'Bridging Data Analytics, Graph RAG & Intelligent AI Systems',
  subtitle:
    'B.B.A. in Computer Information Systems (Digital Innovation and Analytics) at Georgia State University · Former AI Intern @ BalanX Bio · 1st Place Microsoft AI Hackathon Winner.',
}

export const heroStats = [
  { label: '1st Place @ Microsoft Hackathon', metric: '1st', icon: 'trophy' },
  { label: 'Records Analyzed', metric: '1M+', icon: 'database' },
  { label: 'Graph RAG & Neo4j', metric: 'RAG', icon: 'graph' },
  { label: 'PL-300 & AZ-900 Certified', metric: '2×', icon: 'badge' },
] as const

export const heroFacts = [
  {
    label: 'Education',
    value:
      'B.B.A. in Computer Information Systems (Digital Innovation and Analytics), Georgia State University',
    detail: 'Expected May 2027',
  },
  {
    label: 'Now',
    value: 'AI Trainer, Handshake AI · Student Ambassador, GSU Career Services',
    detail: 'Handshake Jul 2026 – Present · Career Services Aug 2026 – Present',
  },
  {
    label: 'Recent',
    value: 'AI Intern, BalanX Bio',
    detail: 'Aug 2026 – Oct 2026 · Remote',
  },
  {
    label: 'Recognition',
    value: '1st Place, Microsoft x NSBE Agent-A-Thon',
    detail: '60-minute live sprint',
  },
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
    company: 'Handshake AI',
    role: 'AI Trainer',
    period: 'Jul 2026 – Present',
    location: 'Remote',
    points: [
      'Evaluated 200+ AI model outputs at 25 to 30 hours weekly, scoring against rubrics and flagging unsupported claims.',
      'Verified model-generated code for correctness and fact-checked outputs against reliable sources, raising output accuracy across programming and subject areas.',
    ],
    tags: ['Model evaluation', 'Code review', 'Fact checking', 'Prompt writing'],
  },
  {
    company: 'GSU Career Services Center',
    role: 'Student Ambassador',
    period: 'Aug 2026 – Present',
    location: 'Atlanta, GA',
    points: [
      'Helped 50 to 100 students every week with resume reviews, interview advice, and career center services at Georgia State.',
      "Scheduled 10 to 15 student appointments every day across the center's resume, interview, and career services.",
      'Reached 50+ students at the weeklong Resume Days event through printed pamphlets and presentations, onboarding students onto VMock automated feedback.',
    ],
    tags: ['VMock', 'Appointment scheduling', 'Event logistics'],
  },
  {
    company: 'BalanX Bio',
    role: 'AI Intern',
    period: 'Aug 2026 – Oct 2026',
    location: 'Remote',
    points: [
      'Contributed to an AI health digital twin proof of concept for an early-stage wearable team (graph-based RAG over a Neo4j knowledge graph), building the baseline statistics layer and the demo dashboard.',
      "Built anomaly detection on a three-tier z-score scale from each user's own sample standard deviation, and cut false-positive trend alerts by gating least-squares slopes behind a two-standard-error threshold.",
      'Shipped 108 automated tests covering statistics, the data contract, and end-to-end rendering, with computation isolated in a service layer so a mock-to-live API switch changes one function.',
      'Built a GitHub knowledge base with Claude Code from 15+ documents, including a 60-page architecture specification, with a 100+ term glossary, and explained the baseline logic to nontechnical stakeholders.',
    ],
    tags: ['Python', 'pandas', 'NumPy', 'Streamlit', 'Altair', 'Claude Code'],
  },
  {
    company: 'The Coca-Cola Company',
    role: 'Sales Representative',
    period: 'May 2025 – Jun 2026',
    location: 'Atlanta, GA',
    points: [
      'Ranked in the top 5% of associates by weekly revenue across 500+ daily customer interactions, and outperformed the peer average by 40% during peak promotional cycles.',
      'Contributed to a 10% year-over-year store revenue increase by building high-traffic product displays.',
      'Cut out-of-stock occurrences by 25% by scanning shelf stock with handheld technology and ordering to demand and expiry.',
      'Reconciled cash, product, and system records within the same shift, held register and inventory variance within 0.5%, and resolved $1,000+ in cumulative discrepancies across $1M in monthly store volume.',
    ],
    tags: ['Inventory Optimization', 'Variance Analysis', 'Transaction Reconciliation'],
  },
  {
    company: 'Association for Information Systems',
    role: 'Student Ambassador',
    period: 'Aug 2024 – May 2026',
    location: 'Atlanta, GA',
    points: [
      'Coordinated professional networking panels and tech workshops that connected CIS majors with industry recruiters.',
      'Managed attendee registration and feedback data, graphing turnout and analyzing post-event feedback to align session topics with student career interests, and presented the findings to program leadership.',
    ],
    tags: ['Leadership', 'Event Analytics', 'Networking'],
  },
  {
    company: 'eXcelerate Computer Training School',
    role: 'Data Analytics Trainee',
    period: 'Aug 2024 – Nov 2024',
    location: 'Marietta, GA',
    points: [
      'Analyzed date-based trends in Snowflake with DATEDIFF, DATEADD, and calculated fields, and corrected data-type mismatches that had returned silently wrong results.',
      'Built and populated tables with CREATE and INSERT, and passed the qualification assessment at 80% or higher (certificate issued July 12, 2025).',
      'Extended the training through independent study of multi-table joins, aggregates, and CAST, then applied them to the RFM and MaternalGrid pipelines.',
    ],
    tags: ['SQL', 'Snowflake', 'DDL / DML'],
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
  youtube?: { id: string; title: string; poster: string }
  /** What was built, in one line. */
  architecture?: string
  /** How it was checked, including stated limits. */
  validated?: string
  /** Shown instead of a code link when the repo is private. */
  repoNote?: string
  /** An extra public link that verifies the claim. */
  proofUrl?: { href: string; label: string }
}

export const projects: Project[] = [
  {
    title: 'The Piedmont Ledger',
    award: 'Honorable Mention',
    blurb:
      'A team investigation of a simulated ticketing-system breach, with a tested alert and a six-week plan',
    tags: ['Python (log analysis)', 'JavaScript', 'HTML / CSS', 'GSAP', 'Cybersecurity'],
    architecture:
      "Per-client baseline alerts, with a simple night-time rule as the comparison, and a fix that limits each API key to its own client's events.",
    validated:
      '54/54 malicious requests flagged with 0 false alarms, against 106 alerts (52 of them false) from the night-time rule. The key limit would have blocked all 525 fake festival tickets.',
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
      'Won 1st place against collegiate and industry professional teams in a 60-minute live build at the Microsoft x NSBE National Convention in Baltimore (Mar 2026), presenting a working AI convention companion to Microsoft judges. The prize included a Microsoft Surface Pro 12-inch.',
    tags: ['Microsoft Copilot Studio', 'AI Agents', 'Outlook connector', 'NSBE'],
    architecture:
      'A Copilot Studio convention companion with a Career Prep module that scores resumes line by line (1 to 100) and offers personalized interview pathways, plus an Outlook connector that pushes event schedules to attendee calendars.',
    validated:
      'Demoed a working app to Microsoft judges and placed 1st.',
    proofUrl: { href: 'https://www.linkedin.com/posts/ore-ajibade_nsbe-microsoftcopilotstudio-aiagents-activity-7441836903118811136-feb-', label: 'LinkedIn post' },
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
      'Segmented 5,878 customers from 1M+ Online Retail II transactions with RFM scoring, with a memo to protect the 2,530 Champions and Loyal Customers behind 84.7% of revenue and win back the 683 Can\'t Lose Them and At Risk customers behind $1.66M in past spend. A Streamlit dashboard serves the segment table, and a Claude API summary drafts plain-language actions per segment.',
    tags: ['Snowflake', 'SQL', 'Python', 'Power BI', 'Streamlit', 'Claude API'],
    liveUrl: 'https://ore-rfm-dashboard.streamlit.app/',
    repoUrl: 'https://github.com/Danorete/AI-RFM-Dashboard',
    thumbnail: '/projects/rfm-dashboard/card.jpg',
    thumbnailAlt:
      'Customer Segment AI Insights dashboard with an RFM segment table and a bar chart of customers per segment',
    architecture:
      'A Snowflake and Python ETL cleans 1,067,371 raw records into 5,878 customers with a drop log, and a scoring script writes one results file. The Streamlit app only reads it, so scoring stays independently testable, and the Claude summary sees segment counts only.',
    validated:
      'Claude API answers were checked against Databricks Genie before any figure was published, and segments sum to all 5,878 customers and $17,374,804.27 in revenue. The win-back offers still need a 60-day holdout test before any lift is claimed.',
    highlights: [
      { metric: '5,878', label: 'Customers Segmented' },
      { metric: '77.2%', label: 'Revenue from Top 20%' },
      { metric: '1M+', label: 'Transaction Records' },
    ],
  },
  {
    title: 'What My Skips Say About How I Listen',
    blurb:
      'A Tableau Public dashboard built from a year of my own Spotify history (Nov 2025 to Nov 2026), cleaned and validated in Python. I skip 47% of streams overall, but only about 26% between midnight and 5 AM versus about 54% from 10 AM to 6 PM.',
    tags: ['Tableau', 'Python', 'pandas', 'Data Validation', 'Data Storytelling'],
    liveUrl:
      'https://public.tableau.com/views/Book1_17941744917780/Dashboard1?:language=en-US&:display_count=n',
    repoUrl: 'https://github.com/Danorete/spotify-listening-bi',
    architecture:
      'A Python pipeline turns the raw Spotify export into aggregated tables, which feed a two-page Tableau Public dashboard.',
    validated:
      '0 duplicates, 0 nulls, and 9 of 9 export files combined. The 32-day December gap is flagged, not filled, and UTC is converted to Eastern.',
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
    title: 'Money Agent: A Budgeting App with an AI Advisor',
    blurb:
      'A personal budgeting and debt payoff app I built and run on my own Mac. It syncs my Chase and Navy Federal accounts through Plaid, keeps transfers, refunds and retirement accounts out of spending, and plans around fixed paydays plus gig income. A Claude advisor answers from my own numbers, but it only suggests. It never moves money, and nothing saves until I click.',
    tags: ['Python', 'Streamlit', 'SQLite', 'Plaid API', 'Claude API', 'pytest'],
    architecture:
      'A local Streamlit and SQLite app where Plaid sync and CSV imports feed one ledger without double counting. Fixed paydays plus a conservative weekly gig floor, after a set aside for tax and gas, drive a 14 day cash forecast, and Claude reaches the data only through 11 read only tools.',
    validated:
      '241 automated tests run on made up bank exports and emails with a fake Plaid and a fake Claude, never my real data. One test checks that no tool sends Claude an account number or a transaction description. The video uses synthetic numbers only.',
    repoNote: 'Private repository',
    highlights: [
      { metric: '241', label: 'Automated Tests' },
      { metric: '11', label: 'Read Only Agent Tools' },
      { metric: '0', label: 'Account Numbers Sent to AI' },
    ],
    thumbnail: '/projects/money-agent/demo-poster.jpg',
    thumbnailAlt:
      'Money Agent advisor screen showing what is sent to Claude, category totals only, and a suggested budget card with a Save to app button',
    video: {
      mp4: '/projects/money-agent/demo.mp4',
      poster: '/projects/money-agent/demo-poster.jpg',
      caption:
        'A 55 second walkthrough with made up numbers: bank sync, a clean ledger, real pay schedules and an advisor that only suggests.',
    },
  },
  {
    title: 'MaternalGrid',
    award: 'Best Use of ElevenLabs',
    blurb:
      'Data and backend lead at HackHers 2026 (HealthHER track), where the team won Best Use of ElevenLabs: a planning tool that shows where Georgia women live too far from labor and delivery care and lets planners simulate closing or opening a delivering hospital. Travel times are modeled, not routed drive times.',
    tags: ['Streamlit', 'Python', 'PostGIS', 'TypeScript', 'Geospatial Analysis'],
    liveUrl: '/projects/maternalgrid/index.html',
    repoUrl: 'https://github.com/Danorete/maternalgrid',
    thumbnail: '/projects/maternalgrid/dashboard.jpg',
    thumbnailAlt:
      'MaternalGrid dashboard showing a map of Georgia counties beyond a 30-minute drive to labor and delivery care, with 74 of 159 counties flagged',
    architecture:
      'A PostGIS travel matrix of 10,812 county-to-facility pairs answers closure simulations in about 48 ms, alongside a Streamlit scenario app, an offline 112 KB dashboard, and a TypeScript API layer.',
    validated:
      'Three supplied datasets were reconciled against GDPH OASIS and March of Dimes files and all three were rejected for mismatches. An 18-check verification suite gates every database load.',
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
    architecture:
      'A Python harness runs 6 synthetic resumes through 4 models and 2 prompt versions, scored against a hand-written answer key, with a Streamlit dashboard.',
    validated:
      '192 blind LLM judgments plus a human review that has the final say. One run per condition, so results are observations, not proof.',
    repoNote: 'Private repository',
    highlights: [
      { metric: '48', label: 'Extractions Scored' },
      { metric: '192', label: 'Blind Judgments' },
      { metric: '3 of 4', label: 'Models Passed All' },
    ],
    thumbnail: '/projects/llm-judge-experiment/field-notes-card.jpg',
    thumbnailAlt:
      'Extraction Field Notes dashboard showing a 94% extraction pass rate and a prompt-by-model pass rate chart where one model drops on the revised prompt',
  },
  {
    title: 'PromptPath Onboarding Copilot',
    blurb:
      'I led the HackATL 2026 team through a Saturday pivot from PromptPath, a practice console where a learner directs an AI coding agent and a manager reviews the result (shown in the video), to a privacy-first Onboarding Copilot. The Copilot, built in one day, maps an unfamiliar dataset for a new hire, strips sensitive values from questions before they reach a model, and cites the table and column behind every answer.',
    tags: ['Streamlit', 'Claude API', 'Python', 'Data Privacy', 'Team Leadership'],
    architecture:
      'Rule-based sensitive-field detection and redaction run before any model call. Answers must cite [table.column], and a source view flags citations not in the data.',
    validated:
      '16 automated tests, including that an SSN or email in a question never reaches the model or the log. An accessibility scan found 0 violations across 7 screens.',
    repoNote: 'Private repository',
    highlights: [
      { metric: '1 day', label: 'Build Time' },
      { metric: '16', label: 'Automated Tests' },
      { metric: '0', label: 'Accessibility Violations' },
    ],
    youtube: {
      id: 'd7tiguM-MkM',
      title: 'PromptPath Platform Demo',
      poster: '/projects/onboarding-copilot/demo-poster.jpg',
    },
    thumbnail: '/projects/onboarding-copilot/ask-answer.png',
    thumbnailAlt:
      'Onboarding Copilot answering a question with cited table and column sources open',
  },
  {
    title: 'WNBA: Womansports Negativity Blocking Assistant',
    blurb:
      'Led a team of 4 at the Microsoft Garage "Code for Change" hackathon (Sep 2026, Microsoft Atlanta office) as team lead and AI engineer. We built an advisory moderation agent for harassment of women athletes, with every enforcement decision left to a human moderator.',
    tags: ['Microsoft AI Foundry', 'Agent Framework SDK', 'Azure OpenAI', 'Python'],
    architecture:
      'An advisory agent on Microsoft AI Foundry and the Agent Framework SDK (Python) with zero autonomous account actions, a three-tier strike framework with 30 and 60 day redemption decay, and a JSON-schema audit trail logged through a tool call.',
    validated:
      'A benchmark of 15 banter posts and 10 harassment examples: 0 false positives, 10 of 10 flagged, and about 850 ms average latency confirmed in Azure AI Foundry Traces. It ran on a trial account, so escalation test case counts were not recorded.',
    highlights: [
      { metric: '10/10', label: 'Harassment Examples Flagged' },
      { metric: '0', label: 'False Positives on 15 Banter Posts' },
      { metric: '~850 ms', label: 'Average Latency' },
    ],
  },
  {
    title: 'AI-Powered Python Study Tutor',
    blurb:
      'A study app I built to practice Python fundamentals. It serves problems chapter by chapter, uses Claude to coach students with Socratic hints instead of giving answers, and adds spaced repetition, exam simulation, and progress tracking.',
    tags: ['Python', 'JavaScript', 'Claude API', 'Spaced Repetition'],
    highlights: [
      { metric: '242', label: 'Practice Problems' },
      { metric: '16', label: 'Textbook Topics' },
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
    name: 'AI & Agent Engineering',
    skills: [
      'Graph RAG',
      'Neo4j',
      'Claude Code',
      'Cursor',
      'Claude API',
      'OpenAI API',
      'Ollama',
      'LM Studio',
      'Prompt engineering & AI agent development',
      'Microsoft Copilot Studio',
      'Azure OpenAI & AI Foundry',
      'Model Context Protocol (MCP)',
    ],
  },
  {
    name: 'Data & Analytics',
    skills: [
      'Python (Pandas, NumPy)',
      'SQL',
      'PostgreSQL / PostGIS',
      'Excel / CSV',
      'Snowflake',
      'Databricks',
      'Power BI',
      'DAX & star-schema modeling',
      'Tableau',
      'Streamlit',
      'RFM Segmentation',
      'Descriptive Statistics',
      'Gap Analysis',
      'Data validation & reconciliation',
      'Financial Metrics (ROI, Margins)',
    ],
  },
  {
    name: 'Cloud, Tooling & Practice',
    skills: [
      'Microsoft Azure',
      'Git / GitHub',
      'HTML / CSS / JavaScript',
      'TypeScript',
      'GSAP animation',
      'Playwright for browser testing',
      'Technical Documentation',
      'Project Management',
      'Cybersecurity',
    ],
  },
  {
    name: 'Certifications',
    skills: [
      'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
      'Microsoft Certified: Azure Fundamentals (AZ-900)',
      'SQL Query Writing Boot Camp, eXcelerate (July 2025)',
    ],
  },
]

export const education = {
  school: 'Georgia State University',
  degree:
    'B.B.A. in Computer Information Systems, Concentration in Digital Innovation and Analytics',
  expected: 'Expected May 2027',
  honors: [
    'Starks Scholarship — Full Tuition Merit Award',
    "Dean's List — Summer 2024, Spring 2025",
    'Honorable Mention — Microsoft x AIS GSU Data Dive, Cybersecurity Track (Oct 2026)',
  ],
  coursework: [
    'Principles of Computer Science I & II',
    'Introduction to Information Systems',
    'Business Analysis',
    'Elementary Statistics',
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
