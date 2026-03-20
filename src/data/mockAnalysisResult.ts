export interface SkillMatch {
  skill: string;
  masteryScore: number; // 0–1 from RNN GRU
  semanticSimilarity: number; // 0–1 from ANN
  source: 'exact' | 'semantic' | 'inferred';
}

export interface SkillGap {
  skill: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  relatedCourses: string[]; // course IDs
  jdMentionCount: number;
}

export interface RoadmapCourse {
  courseId: string;
  title: string;
  domain: string;
  durationWeeks: number;
  level: string;
  position: number; // order in roadmap
  prerequisites: string[]; // course IDs
  addressesGaps: string[]; // skill names
  masteryGain: number; // estimated mastery boost 0–1
  isUnlocked: boolean;
  instructor: string;
  rating: number;
}

export interface AnalysisResult {
  candidateName: string;
  targetRole: string;
  analyzedAt: string;
  matchRate: number;
  gapCount: number;
  totalWeeks: number;
  courseCount: number;
  avgMastery: number;
  matchedSkills: SkillMatch[];
  gapSkills: SkillGap[];
  roadmap: RoadmapCourse[];
  reasoningTrace: string;
  domainCoverage: { domain: string; matched: number; total: number }[];
}

export const mockAnalysisResult: AnalysisResult = {
  candidateName: 'Kavya Menon',
  targetRole: 'Senior Full-Stack AI Engineer',
  analyzedAt: '2026-03-20T08:36:13Z',
  matchRate: 61,
  gapCount: 9,
  totalWeeks: 18,
  courseCount: 8,
  avgMastery: 0.58,

  matchedSkills: [
    { skill: 'React', masteryScore: 0.82, semanticSimilarity: 1.0, source: 'exact' },
    { skill: 'TypeScript', masteryScore: 0.76, semanticSimilarity: 0.97, source: 'exact' },
    { skill: 'Python', masteryScore: 0.88, semanticSimilarity: 1.0, source: 'exact' },
    { skill: 'PostgreSQL', masteryScore: 0.71, semanticSimilarity: 0.94, source: 'exact' },
    { skill: 'Docker', masteryScore: 0.65, semanticSimilarity: 0.99, source: 'exact' },
    { skill: 'REST API', masteryScore: 0.79, semanticSimilarity: 0.96, source: 'exact' },
    { skill: 'Git', masteryScore: 0.91, semanticSimilarity: 1.0, source: 'exact' },
    { skill: 'Node.js', masteryScore: 0.58, semanticSimilarity: 0.88, source: 'semantic' },
    { skill: 'Agile', masteryScore: 0.74, semanticSimilarity: 0.85, source: 'semantic' },
    { skill: 'System Design', masteryScore: 0.44, semanticSimilarity: 0.79, source: 'inferred' },
  ],

  gapSkills: [
    { skill: 'LLMs / Prompt Engineering', priority: 'critical', relatedCourses: ['c035'], jdMentionCount: 4 },
    { skill: 'FastAPI', priority: 'critical', relatedCourses: ['c012'], jdMentionCount: 3 },
    { skill: 'Kubernetes', priority: 'high', relatedCourses: ['c024'], jdMentionCount: 3 },
    { skill: 'PyTorch / Deep Learning', priority: 'high', relatedCourses: ['c033'], jdMentionCount: 2 },
    { skill: 'Sentence Transformers', priority: 'high', relatedCourses: ['c036'], jdMentionCount: 2 },
    { skill: 'Redis', priority: 'medium', relatedCourses: ['c017'], jdMentionCount: 2 },
    { skill: 'CI/CD Pipelines', priority: 'medium', relatedCourses: ['c025'], jdMentionCount: 1 },
    { skill: 'MLOps', priority: 'medium', relatedCourses: ['c037'], jdMentionCount: 1 },
    { skill: 'GraphQL', priority: 'low', relatedCourses: ['c018'], jdMentionCount: 1 },
  ],

  roadmap: [
    {
      courseId: 'c012',
      title: 'FastAPI — Modern Python APIs',
      domain: 'Backend',
      durationWeeks: 3,
      level: 'Intermediate',
      position: 1,
      prerequisites: [],
      addressesGaps: ['FastAPI', 'REST API', 'Async Python'],
      masteryGain: 0.71,
      isUnlocked: true,
      instructor: 'Sofia Reyes',
      rating: 4.9,
    },
    {
      courseId: 'c017',
      title: 'Redis & Caching Strategies',
      domain: 'Backend',
      durationWeeks: 2,
      level: 'Intermediate',
      position: 2,
      prerequisites: ['c012'],
      addressesGaps: ['Redis', 'Caching', 'Session Management'],
      masteryGain: 0.62,
      isUnlocked: false,
      instructor: 'Lena Müller',
      rating: 4.6,
    },
    {
      courseId: 'c025',
      title: 'CI/CD with GitHub Actions',
      domain: 'DevOps',
      durationWeeks: 2,
      level: 'Intermediate',
      position: 3,
      prerequisites: [],
      addressesGaps: ['CI/CD Pipelines', 'Automated Testing'],
      masteryGain: 0.68,
      isUnlocked: true,
      instructor: 'Marcus Johnson',
      rating: 4.7,
    },
    {
      courseId: 'c023',
      title: 'Docker — Containerization Mastery',
      domain: 'DevOps',
      durationWeeks: 2,
      level: 'Intermediate',
      position: 4,
      prerequisites: ['c025'],
      addressesGaps: ['Docker Advanced', 'Image Optimization'],
      masteryGain: 0.55,
      isUnlocked: false,
      instructor: 'Arjun Patel',
      rating: 4.9,
    },
    {
      courseId: 'c024',
      title: 'Kubernetes — Orchestration at Scale',
      domain: 'DevOps',
      durationWeeks: 4,
      level: 'Advanced',
      position: 5,
      prerequisites: ['c023'],
      addressesGaps: ['Kubernetes', 'K8s', 'Helm'],
      masteryGain: 0.74,
      isUnlocked: false,
      instructor: 'Sofia Reyes',
      rating: 4.8,
    },
    {
      courseId: 'c033',
      title: 'Deep Learning with PyTorch',
      domain: 'Data & AI',
      durationWeeks: 5,
      level: 'Advanced',
      position: 6,
      prerequisites: [],
      addressesGaps: ['PyTorch / Deep Learning', 'RNNs', 'GRU', 'LSTM'],
      masteryGain: 0.78,
      isUnlocked: true,
      instructor: 'Sofia Reyes',
      rating: 4.9,
    },
    {
      courseId: 'c036',
      title: 'Sentence Transformers & Semantic Search',
      domain: 'Data & AI',
      durationWeeks: 2,
      level: 'Advanced',
      position: 7,
      prerequisites: ['c033'],
      addressesGaps: ['Sentence Transformers', 'Semantic Search', 'Embeddings'],
      masteryGain: 0.69,
      isUnlocked: false,
      instructor: 'Lena Müller',
      rating: 4.7,
    },
    {
      courseId: 'c035',
      title: 'LLM Engineering & Prompt Design',
      domain: 'Data & AI',
      durationWeeks: 3,
      level: 'Advanced',
      position: 8,
      prerequisites: ['c036'],
      addressesGaps: ['LLMs / Prompt Engineering', 'Claude API', 'RAG'],
      masteryGain: 0.81,
      isUnlocked: false,
      instructor: 'Priya Sharma',
      rating: 4.9,
    },
  ],

  reasoningTrace: `**Skill Extraction Analysis (Claude GenAI Layer)**

After parsing Kavya's resume and the target job description for Senior Full-Stack AI Engineer, I identified 10 matched skills and 9 critical gaps. Kavya demonstrates strong frontend proficiency with React (82% mastery) and TypeScript (76%), and solid Python fundamentals (88%), which form an excellent foundation.

**Semantic Matching Results (ANN — sentence-transformers)**

The ANN layer normalized skill terminology across both documents. "Node.js/Express experience" in the resume was semantically matched to "Backend API development" in the JD with 88% cosine similarity. "Agile ceremonies" matched "Scrum methodology" at 85%. However, "ML experience" on the resume did not semantically align with the JD's specific requirements for PyTorch, GRU-based knowledge tracing, or sentence-transformers — these remain hard gaps.

**Knowledge Tracing & Mastery Scoring (RNN — PyTorch GRU)**

The GRU model analyzed skill co-occurrence patterns and prerequisite dependencies. Kavya's existing Python and Docker knowledge reduces the learning overhead for FastAPI and CI/CD courses significantly. The model estimates 18 weeks to reach ≥75% mastery across all gap skills, assuming 10–12 hours/week of study. Priority order: FastAPI first (unlocks 3 downstream courses), then PyTorch (unlocks Sentence Transformers + LLM Engineering), then Kubernetes. The critical path runs: FastAPI → Redis → Kubernetes, and independently: PyTorch → Sentence Transformers → LLM Engineering.`,

  domainCoverage: [
    { domain: 'Frontend', matched: 5, total: 6 },
    { domain: 'Backend', matched: 3, total: 7 },
    { domain: 'DevOps', matched: 2, total: 6 },
    { domain: 'Data & AI', matched: 1, total: 6 },
    { domain: 'Soft Skills', matched: 3, total: 4 },
    { domain: 'Operations', matched: 1, total: 3 },
  ],
};