import { AnalysisResult, SkillMatch, SkillGap, RoadmapCourse } from '@/data/mockAnalysisResult';

export function mapBackendResponse(backendData: any, targetRole: string): AnalysisResult {
  const {
    candidate_skills,
    required_skills,
    skill_gaps,
    learning_path,
    reasoning_trace,
    estimated_hours_saved,
    total_hours
  } = backendData;

  const matchedSkills: SkillMatch[] = candidate_skills.map((s: any) => ({
    skill: s.skill,
    masteryScore: s.level === 'expert' ? 0.9 : s.level === 'advanced' ? 0.75 : s.level === 'intermediate' ? 0.5 : 0.25,
    semanticSimilarity: 1.0,
    source: 'exact'
  }));

  const gapSkills: SkillGap[] = [
    ...skill_gaps.missing.map((s: string) => ({
      skill: s,
      priority: 'critical' as const,
      relatedCourses: [],
      jdMentionCount: 1
    })),
    ...skill_gaps.weak.map((s: any) => ({
      skill: s.skill,
      priority: s.priority === 'core' ? ('critical' as const) : s.priority === 'important' ? ('high' as const) : ('medium' as const),
      relatedCourses: [],
      jdMentionCount: 1
    }))
  ];

  const roadmap: RoadmapCourse[] = learning_path.map((c: any, index: number) => ({
    courseId: c.id,
    title: c.title,
    domain: c.domain,
    durationWeeks: Math.ceil(c.duration_hours / 10),
    level: c.level,
    position: index + 1,
    prerequisites: c.prerequisites || [],
    addressesGaps: c.skills_covered || [],
    masteryGain: 0.5,
    isUnlocked: (c.prerequisites || []).length === 0,
    instructor: 'PathForge AI',
    rating: 4.8
  }));

  // Simple domain coverage calculation
  const domains = ['Frontend', 'Backend', 'DevOps', 'Data & AI'];
  const domainCoverage = domains.map(domain => {
    const matched = matchedSkills.filter(s => s.skill.toLowerCase().includes(domain.toLowerCase())).length;
    return { domain, matched, total: matched + 2 }; // Dummy total for now
  });

  return {
    candidateName: 'Candidate',
    targetRole,
    analyzedAt: new Date().toISOString(),
    matchRate: Math.round((skill_gaps.satisfied.length / required_skills.length) * 100) || 0,
    gapCount: gapSkills.length,
    totalWeeks: Math.ceil(total_hours / 10),
    courseCount: roadmap.length,
    avgMastery: 0.5,
    matchedSkills,
    gapSkills,
    roadmap,
    reasoningTrace: reasoning_trace,
    domainCoverage
  };
}
