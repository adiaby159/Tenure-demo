/**
 * Seeds two founding pilot clubs from bible §15 with realistic data:
 *   1. Simon Entrepreneurship Association (SEA) — Almamy Diaby, President
 *   2. Net Impact — Felicitas Van Thienen, President
 *
 * Also seeds all four standard roles, their templates, and a handful of
 * sample cards on the President workspace so Phase 1 has real content to show.
 *
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 * Or via: npx prisma db seed
 */

import { PrismaClient, CardType, Visibility, ClubCategory, AssignmentStatus } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// ---------------------------------------------------------------------------
// Role templates (bible §6/§9)
// ---------------------------------------------------------------------------

const presidentTemplate = {
  ownedTypes: ['charter', 'contact', 'thread', 'project', 'lesson'] as CardType[],
  requiredTypes: ['charter', 'contact', 'thread', 'project'] as CardType[],
  fieldSpec: {
    charter: [
      { key: 'mission', label: 'Mission', type: 'textarea' },
      { key: 'goals', label: 'Goals (1–n)', type: 'list' },
      { key: 'realScope', label: 'Real scope', type: 'textarea' },
      { key: 'timeCommitment', label: 'Time commitment', type: 'text' },
      { key: 'keyCounterparts', label: 'Key counterparts', type: 'text' },
      { key: 'whyThisCardExists', label: 'Why this card exists', type: 'textarea' },
    ],
    contact: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'roleTitle', label: 'Role / title', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'howToEngage', label: 'How to engage', type: 'textarea' },
      { key: 'relationshipHistory', label: 'Relationship history', type: 'textarea' },
      { key: 'requiredCadence', label: 'Required cadence', type: 'text' },
    ],
    thread: [
      { key: 'status', label: 'Status', type: 'text' },
      { key: 'owner', label: 'Owner', type: 'text' },
      { key: 'counterpart', label: 'Counterpart', type: 'text' },
      { key: 'nextStep', label: 'Next step', type: 'textarea' },
      { key: 'whyItMatters', label: 'Why it matters', type: 'textarea' },
    ],
    project: [
      { key: 'jdReference', label: 'JD reference (required)', type: 'text' },
      { key: 'status', label: 'Status', type: 'text' },
      { key: 'sourceData', label: 'Source data', type: 'textarea' },
      { key: 'due', label: 'Due date', type: 'date' },
      { key: 'owner', label: 'Owner', type: 'text' },
    ],
    lesson: [
      { key: 'lesson', label: 'Lesson', type: 'textarea' },
      { key: 'evidence', label: 'Evidence', type: 'textarea' },
      { key: 'action', label: 'Action for successor', type: 'textarea' },
      { key: 'whyThisCardExists', label: 'Why this card exists', type: 'textarea' },
    ],
  },
  overview: {
    scope: 'Overall vision, leadership, and coordination with VPs. Sets strategic direction and goals.',
    duties: [
      { label: 'Strategic leadership', detail: 'Define/update mission, values, vision; lead business-plan creation; set goals.' },
      { label: 'Club management', detail: 'Lead board meetings; ensure events are planned; distribute Fall + Spring member surveys.' },
      { label: 'Representation', detail: 'Represent club to Simon community; communicate with advisor.' },
      { label: 'Leadership Accelerator', detail: 'Attend 2× per mini-mester; GBC VP-of-Student-Leadership meetings 1× per mini-mester.' },
      { label: 'Collaboration', detail: 'Regular check-ins with each VP; partner with Benet CMC; foster alumni relationships.' },
      { label: 'Evaluation & reporting', detail: 'Self-evaluation per mini-mester; 1:1 VP reviews; annual club overview booklet.' },
    ],
  },
}

const vpFinanceTemplate = {
  ownedTypes: ['budget', 'project', 'contact', 'eval', 'lesson'] as CardType[],
  requiredTypes: ['budget', 'contact', 'project'] as CardType[],
  fieldSpec: {
    budget: [
      { key: 'allocation', label: 'Allocation', type: 'text' },
      { key: 'carryover', label: 'Carryover', type: 'text' },
      { key: 'liveBalance', label: 'Live balance', type: 'text' },
      { key: 'monthlyAuditStatus', label: 'Monthly audit status', type: 'text' },
    ],
    contact: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'roleTitle', label: 'Role / title', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'howToEngage', label: 'How to engage', type: 'textarea' },
      { key: 'relationshipHistory', label: 'Relationship history', type: 'textarea' },
      { key: 'requiredCadence', label: 'Required cadence', type: 'text' },
    ],
    project: [
      { key: 'jdReference', label: 'JD reference (required)', type: 'text' },
      { key: 'status', label: 'Status', type: 'text' },
      { key: 'sourceData', label: 'Source data', type: 'textarea' },
      { key: 'due', label: 'Due date', type: 'date' },
      { key: 'owner', label: 'Owner', type: 'text' },
    ],
    eval: [
      { key: 'jdReference', label: 'JD reference (required)', type: 'text' },
      { key: 'budgetVsActual', label: 'Budget vs. actual', type: 'textarea' },
      { key: 'attendance', label: 'Attendance', type: 'text' },
      { key: 'roiPerAttendee', label: 'ROI / attendee', type: 'text' },
      { key: 'lessons', label: 'Lessons', type: 'textarea' },
      { key: 'recipient', label: 'Recipient', type: 'text' },
    ],
    lesson: [
      { key: 'lesson', label: 'Lesson', type: 'textarea' },
      { key: 'evidence', label: 'Evidence', type: 'textarea' },
      { key: 'action', label: 'Action for successor', type: 'textarea' },
      { key: 'whyThisCardExists', label: 'Why this card exists', type: 'textarea' },
    ],
  },
  overview: {
    scope: 'Lead of all club finances and internal operations. Maintains a live, up-to-date record of available balance.',
    duties: [
      { label: 'Finance tracking & auditing', detail: 'Set dues price point; create budget projections; manage live balance; monthly audits with Kam McMillian.' },
      { label: 'Reimbursements', detail: 'Enforce reimbursement procedures + OSE financial policies; invoices paid in advance.' },
      { label: 'Club operations', detail: 'Create board-meeting agendas; take + maintain + file meeting minutes.' },
      { label: 'Post-event evaluations', detail: 'Post-event evaluations in business-plan workbook.' },
      { label: 'Year-end breakdown', detail: 'Year-end expense breakdown (budget spent per event).' },
      { label: 'Board outing', detail: 'Organize a board outing; help first-year MBA reps + MS VPs acclimate.' },
    ],
  },
}

const vpMarketingTemplate = {
  ownedTypes: ['project', 'contact', 'lesson', 'thread'] as CardType[],
  requiredTypes: ['project', 'contact'] as CardType[],
  fieldSpec: {
    project: [
      { key: 'jdReference', label: 'JD reference (required)', type: 'text' },
      { key: 'status', label: 'Status', type: 'text' },
      { key: 'sourceData', label: 'Source data', type: 'textarea' },
      { key: 'due', label: 'Due date', type: 'date' },
      { key: 'owner', label: 'Owner', type: 'text' },
    ],
    contact: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'roleTitle', label: 'Role / title', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'howToEngage', label: 'How to engage', type: 'textarea' },
      { key: 'relationshipHistory', label: 'Relationship history', type: 'textarea' },
      { key: 'requiredCadence', label: 'Required cadence', type: 'text' },
    ],
    lesson: [
      { key: 'lesson', label: 'Lesson', type: 'textarea' },
      { key: 'evidence', label: 'Evidence', type: 'textarea' },
      { key: 'action', label: 'Action for successor', type: 'textarea' },
      { key: 'whyThisCardExists', label: 'Why this card exists', type: 'textarea' },
    ],
    thread: [
      { key: 'status', label: 'Status', type: 'text' },
      { key: 'owner', label: 'Owner', type: 'text' },
      { key: 'counterpart', label: 'Counterpart', type: 'text' },
      { key: 'nextStep', label: 'Next step', type: 'textarea' },
      { key: 'whyItMatters', label: 'Why it matters', type: 'textarea' },
    ],
  },
  overview: {
    scope: 'Lead of all club communications — members, Simon community, external partners.',
    duties: [
      { label: 'Slack management', detail: 'Manage club Slack channel + member comms; holds #events channel posting permission.' },
      { label: 'Marketing strategy', detail: 'Create/implement marketing strategies for recruitment.' },
      { label: 'Content creation', detail: 'Lead photography + content; post on club social platforms per Simon Marketing guidelines.' },
      { label: 'Canva', detail: 'Create all promotional material on the Simon Student Canva account.' },
      { label: 'Marketing training', detail: 'Attend marketing training + Fall A refresher with Student Life liaison.' },
      { label: 'Evaluation & reporting', detail: 'Self-evaluation per mini-mester; contribute event photos + info to the annual overview booklet.' },
    ],
  },
}

const vpEventsTemplate = {
  ownedTypes: ['playbook', 'contact', 'project', 'eval', 'sponsor', 'lesson'] as CardType[],
  requiredTypes: ['playbook', 'contact', 'project', 'eval'] as CardType[],
  fieldSpec: {
    playbook: [
      { key: 'timing', label: 'Timing', type: 'text' },
      { key: 'simonSourceWindow', label: 'SimonSource submission window', type: 'text' },
      { key: 'budgetBreakdown', label: 'Budget breakdown', type: 'textarea' },
      { key: 'judgesSpeakers', label: 'Judges / speakers', type: 'textarea' },
      { key: 'cohost', label: 'Co-host', type: 'text' },
      { key: 'whatWorked', label: 'What worked', type: 'textarea' },
      { key: 'whatFailed', label: 'What failed', type: 'textarea' },
      { key: 'partnershipCredit', label: 'Partnership credit', type: 'text' },
    ],
    contact: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'roleTitle', label: 'Role / title', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'howToEngage', label: 'How to engage', type: 'textarea' },
      { key: 'relationshipHistory', label: 'Relationship history', type: 'textarea' },
      { key: 'requiredCadence', label: 'Required cadence', type: 'text' },
    ],
    project: [
      { key: 'jdReference', label: 'JD reference (required)', type: 'text' },
      { key: 'status', label: 'Status', type: 'text' },
      { key: 'sourceData', label: 'Source data', type: 'textarea' },
      { key: 'due', label: 'Due date', type: 'date' },
      { key: 'owner', label: 'Owner', type: 'text' },
    ],
    eval: [
      { key: 'jdReference', label: 'JD reference (required)', type: 'text' },
      { key: 'budgetVsActual', label: 'Budget vs. actual', type: 'textarea' },
      { key: 'attendance', label: 'Attendance', type: 'text' },
      { key: 'roiPerAttendee', label: 'ROI / attendee', type: 'text' },
      { key: 'lessons', label: 'Lessons', type: 'textarea' },
      { key: 'recipient', label: 'Recipient', type: 'text' },
    ],
    sponsor: [
      { key: 'contact', label: 'Contact', type: 'text' },
      { key: 'history', label: 'History', type: 'textarea' },
      { key: 'renewalPlay', label: 'Renewal play', type: 'textarea' },
      { key: 'dollarAmount', label: 'Dollar amount', type: 'text' },
      { key: 'renewalDate', label: 'Renewal date', type: 'date' },
    ],
    lesson: [
      { key: 'lesson', label: 'Lesson', type: 'textarea' },
      { key: 'evidence', label: 'Evidence', type: 'textarea' },
      { key: 'action', label: 'Action for successor', type: 'textarea' },
      { key: 'whyThisCardExists', label: 'Why this card exists', type: 'textarea' },
    ],
  },
  overview: {
    scope: 'Lead organizer of event logistics + cross-club partnerships. Net Impact liaison for the Impact Initiative.',
    duties: [
      { label: 'Event planning', detail: 'Create impactful events; submit proposals ≥3 weeks in advance via SimonSource.' },
      { label: 'Logistics', detail: 'Work with VP Marketing for advertising lead time, day-of support, set-up, clean-up.' },
      { label: 'Cross-club partnerships', detail: 'Required: ≥1 cross-club partnership per academic year.' },
      { label: 'Impact Initiative', detail: 'Collaborate with Net Impact; submit Post-Event Evaluation Forms for impactful events.' },
      { label: 'Budget coordination', detail: 'Work with VP Finance on event budgets + payments.' },
      { label: 'Year-end breakdown', detail: 'Year-end event-logistics breakdown for the overview booklet.' },
    ],
  },
}

async function main() {
  console.log('Seeding Tenure database...')

  // 1. Role templates
  const presidentTmpl = await prisma.roleTemplate.upsert({
    where: { roleKey: 'president' },
    update: presidentTemplate,
    create: { roleKey: 'president', ...presidentTemplate },
  })
  const vpFinanceTmpl = await prisma.roleTemplate.upsert({
    where: { roleKey: 'vp_finance_ops' },
    update: vpFinanceTemplate,
    create: { roleKey: 'vp_finance_ops', ...vpFinanceTemplate },
  })
  const vpMarketingTmpl = await prisma.roleTemplate.upsert({
    where: { roleKey: 'vp_marketing_comms' },
    update: vpMarketingTemplate,
    create: { roleKey: 'vp_marketing_comms', ...vpMarketingTemplate },
  })
  const vpEventsTmpl = await prisma.roleTemplate.upsert({
    where: { roleKey: 'vp_events_partnerships' },
    update: vpEventsTemplate,
    create: { roleKey: 'vp_events_partnerships', ...vpEventsTemplate },
  })

  // 2. Roles
  const presidentRole = await prisma.role.upsert({
    where: { key: 'president' },
    update: { label: 'President', templateId: presidentTmpl.id },
    create: { key: 'president', label: 'President', isStandard: true, templateId: presidentTmpl.id },
  })
  const vpFinanceRole = await prisma.role.upsert({
    where: { key: 'vp_finance_ops' },
    update: { label: 'VP Finance & Operations', templateId: vpFinanceTmpl.id },
    create: { key: 'vp_finance_ops', label: 'VP Finance & Operations', isStandard: true, templateId: vpFinanceTmpl.id },
  })
  const vpMarketingRole = await prisma.role.upsert({
    where: { key: 'vp_marketing_comms' },
    update: { label: 'VP Marketing & Communications', templateId: vpMarketingTmpl.id },
    create: { key: 'vp_marketing_comms', label: 'VP Marketing & Communications', isStandard: true, templateId: vpMarketingTmpl.id },
  })
  const vpEventsRole = await prisma.role.upsert({
    where: { key: 'vp_events_partnerships' },
    update: { label: 'VP Events & Partnerships', templateId: vpEventsTmpl.id },
    create: { key: 'vp_events_partnerships', label: 'VP Events & Partnerships', isStandard: true, templateId: vpEventsTmpl.id },
  })

  // 3. Clubs
  const sea = await prisma.club.upsert({
    where: { id: 'sea' },
    update: { name: 'Simon Entrepreneurship Association', shortName: 'SEA', category: ClubCategory.ProfessionalClub },
    create: { id: 'sea', name: 'Simon Entrepreneurship Association', shortName: 'SEA', category: ClubCategory.ProfessionalClub, advisorIds: ['Brittany Grage'] },
  })
  const netImpact = await prisma.club.upsert({
    where: { id: 'net-impact' },
    update: { name: 'Net Impact', shortName: 'NI', category: ClubCategory.ProfessionalClub },
    create: { id: 'net-impact', name: 'Net Impact', shortName: 'NI', category: ClubCategory.ProfessionalClub, advisorIds: ['Brittany Grage'] },
  })

  // 4. Users (from §3.1/§15)
  const almamy = await prisma.user.upsert({
    where: { email: 'almamy.diaby@simon.rochester.edu' },
    update: {},
    create: { name: 'Almamy Diaby', email: 'almamy.diaby@simon.rochester.edu', avatarInitials: 'AD' },
  })
  const yhoselin = await prisma.user.upsert({
    where: { email: 'yhoselin.beltran@simon.rochester.edu' },
    update: {},
    create: { name: 'Yhoselin Beltran', email: 'yhoselin.beltran@simon.rochester.edu', avatarInitials: 'YB' },
  })
  const maya = await prisma.user.upsert({
    where: { email: 'maya.cohen@simon.rochester.edu' },
    update: {},
    create: { name: 'Maya Cohen', email: 'maya.cohen@simon.rochester.edu', avatarInitials: 'MC' },
  })
  const quang = await prisma.user.upsert({
    where: { email: 'quang.quach@simon.rochester.edu' },
    update: {},
    create: { name: 'Quang Quach', email: 'quang.quach@simon.rochester.edu', avatarInitials: 'QQ' },
  })
  const felicitas = await prisma.user.upsert({
    where: { email: 'felicitas.vanthienen@simon.rochester.edu' },
    update: {},
    create: { name: 'Felicitas Van Thienen', email: 'felicitas.vanthienen@simon.rochester.edu', avatarInitials: 'FV' },
  })

  // 5. RoleAssignments (term: 2025-05-01 → 2026-04-30 — "current board")
  const termStart = new Date('2025-05-01')
  const termEnd = new Date('2026-04-30')

  await prisma.roleAssignment.upsert({
    where: { id: 'ra-almamy-sea-president' },
    update: {},
    create: { id: 'ra-almamy-sea-president', userId: almamy.id, clubId: sea.id, roleId: presidentRole.id, termStart, termEnd, status: AssignmentStatus.active },
  })
  await prisma.roleAssignment.upsert({
    where: { id: 'ra-yhoselin-sea-finance' },
    update: {},
    create: { id: 'ra-yhoselin-sea-finance', userId: yhoselin.id, clubId: sea.id, roleId: vpFinanceRole.id, termStart, termEnd, status: AssignmentStatus.active },
  })
  await prisma.roleAssignment.upsert({
    where: { id: 'ra-maya-sea-marketing' },
    update: {},
    create: { id: 'ra-maya-sea-marketing', userId: maya.id, clubId: sea.id, roleId: vpMarketingRole.id, termStart, termEnd, status: AssignmentStatus.active },
  })
  await prisma.roleAssignment.upsert({
    where: { id: 'ra-quang-sea-events' },
    update: {},
    create: { id: 'ra-quang-sea-events', userId: quang.id, clubId: sea.id, roleId: vpEventsRole.id, termStart, termEnd, status: AssignmentStatus.active },
  })
  await prisma.roleAssignment.upsert({
    where: { id: 'ra-felicitas-ni-president' },
    update: {},
    create: { id: 'ra-felicitas-ni-president', userId: felicitas.id, clubId: netImpact.id, roleId: presidentRole.id, termStart, termEnd, status: AssignmentStatus.active },
  })

  // 6. Sample cards for the SEA President workspace
  const seaCards = [
    {
      id: 'card-sea-charter',
      type: CardType.charter,
      title: 'SEA Role Charter',
      summary: 'Defines the real scope, time commitment, and key counterparts for the SEA President.',
      visibility: Visibility.role,
      fields: {
        mission: 'Foster an entrepreneurial mindset across the Simon community by connecting students with founders, operators, and ideas that challenge the status quo.',
        goals: [
          'Grow active dues-paying membership by 20% over last year',
          'Run ≥1 event per mini-mester with ≥30 attendees',
          'Deliver 1 signature event (Pitch Night) by Spring A',
        ],
        realScope: 'You are effectively the CEO of a 4-person board with a $12,000 annual budget. More coordination than execution — your job is to unblock the VPs, not to do their work.',
        timeCommitment: '8–12 hrs/week during active semesters; 4–6 hrs/week during transition months.',
        keyCounterparts: 'Brittany Grage (OSE Director), Kam McMillian (Finance), Gina Ignatti (Events), Benet CMC advisors, GBC President.',
        whyThisCardExists: 'Every incoming President should read this in week one. It saves 4–6 weeks of figuring out "what does this role actually do."',
      },
    },
    {
      id: 'card-sea-contact-brittany',
      type: CardType.contact,
      title: 'Brittany Grage — OSE Director',
      summary: 'Primary OSE relationship. Runs Leadership Accelerator. Strategic ally.',
      visibility: Visibility.role,
      fields: {
        name: 'Brittany Grage',
        roleTitle: 'Director of Student Life',
        email: 'bgrage@simon.rochester.edu',
        howToEngage: 'Email to set up 1:1; attend Leadership Accelerator (2× per mini-mester — mandatory). She responds same-day on email. Don\'t Slack her.',
        relationshipHistory: 'Very supportive of SEA. She flagged our Fall Pitch Night as a model event to other clubs. Mentioned interest in formalizing the Tenure pilot through her office.',
        requiredCadence: '2× per mini-mester (Leadership Accelerator) + ad hoc as needed.',
      },
    },
    {
      id: 'card-sea-contact-kam',
      type: CardType.contact,
      title: 'Kam McMillian — Finance Liaison',
      summary: 'Owns all monthly finance audits and invoice approvals.',
      visibility: Visibility.club,
      fields: {
        name: 'Kam McMillian',
        roleTitle: 'Associate Director of Student Engagement',
        email: 'kmcmillan@simon.rochester.edu',
        howToEngage: 'Loop in VP Finance for all financial items. Monthly audit meeting is standing — VP Finance schedules it, President joins if there are strategic items.',
        relationshipHistory: 'Straightforward and process-oriented. Invoices paid before events is non-negotiable for her. We had one late invoice Fall A — she flagged it. Never again.',
        requiredCadence: 'Monthly (audit); VP Finance owns the cadence.',
      },
    },
    {
      id: 'card-sea-thread-business-plan',
      type: CardType.thread,
      title: 'Annual Business Plan — Spring B submission',
      summary: 'Due Apr 23. Board members + roles, mission + goals, dues + budget, events.',
      visibility: Visibility.club,
      fields: {
        status: 'In progress',
        owner: 'Almamy Diaby (President)',
        counterpart: 'Benet CMC advisors + OSE',
        nextStep: 'VP Finance to finalize projected dues + budget by Apr 7. Events section needs Quang\'s event list with WIFM for each.',
        whyItMatters: 'This is the club\'s operating license for the year. Late or incomplete = no Fall A events approved.',
      },
    },
    {
      id: 'card-sea-project-overview-booklet',
      type: CardType.project,
      title: 'Annual Club Overview Booklet',
      summary: 'Required JD artifact. Summarizes activities, outcomes, and initiatives for the year.',
      visibility: Visibility.club,
      fields: {
        jdReference: 'President JD — Evaluation & reporting: "annual club overview booklet summarizing activities, outcomes, initiatives"',
        status: 'Not started',
        sourceData: 'Event recaps from Quang; attendance data from SimonSource; photos from Maya; budget summary from Yhoselin.',
        due: '2026-04-15',
        owner: 'Almamy Diaby (President)',
      },
    },
    {
      id: 'card-sea-lesson-transition',
      type: CardType.lesson,
      title: 'The April transition timing trap',
      summary: 'Critical warning for every incoming President.',
      visibility: Visibility.role,
      fields: {
        lesson: 'The handoff collides with peak recruiting for both outgoing and incoming leaders. Everyone is distracted. Do not plan a "coffee chat handoff" — it will be inadequate.',
        evidence: 'Spring 2025: the outgoing President had 3 final-round interviews during transition week. The incoming board didn\'t have access to the budget until May 10.',
        action: 'Start shadow access 6 weeks before term start. Schedule ≥2 full-board overlap meetings AND ≥1 1:1 per VP role. Block your calendar in advance. This is in the OSE transition calendar for a reason.',
        whyThisCardExists: 'This is the single most important operational lesson from this year. Read it before you plan anything.',
      },
    },
  ]

  for (const card of seaCards) {
    await prisma.card.upsert({
      where: { id: card.id },
      update: {},
      create: {
        id: card.id,
        clubId: sea.id,
        owningRoleId: presidentRole.id,
        type: card.type,
        title: card.title,
        summary: card.summary,
        fields: card.fields,
        visibility: card.visibility,
        createdById: almamy.id,
      },
    })
  }

  console.log('✅ Seed complete.')
  console.log(`   Clubs: SEA (${sea.id}), Net Impact (${netImpact.id})`)
  console.log(`   Users: Almamy, Yhoselin, Maya, Quang (SEA) + Felicitas (NI)`)
  console.log(`   Cards: ${seaCards.length} sample cards on SEA President workspace`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
