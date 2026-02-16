import SyntheticProfile from '@/models/SyntheticProfile';
import CarePlan from '@/models/CarePlan';
import CareStep from '@/models/CareStep';
import Dependency from '@/models/Dependency';
import RiskMetadata from '@/models/RiskMetadata';
import connectDB from '@/lib/mongodb';

class JourneyService {
  async getCompleteJourney(profileId: string) {
    await connectDB();

    const profile = await SyntheticProfile.findOne({ profileId }).lean();
    if (!profile) return null;

    const [carePlan, steps, dependencies] = await Promise.all([
      CarePlan.findOne({ templateId: profile.carePlanId }).lean(),
      CareStep.find({ carePlanId: profile.carePlanId }).sort({ 'timing.startDay': 1 }).lean(),
      Dependency.find({ carePlanId: profile.carePlanId }).lean()
    ]);

    if (!carePlan) return null;

    const stepIds = steps.map(s => s.stepId);
    const riskData = await RiskMetadata.find({ stepId: { $in: stepIds } }).lean();

    const timeline = this.buildTimeline(steps, carePlan.durationDays);
    const complexityAnalysis = this.analyzeComplexity(steps, dependencies, carePlan);

    return {
      profile,
      carePlan,
      steps,
      dependencies,
      riskData,
      timeline,
      complexityAnalysis,
      metadata: {
        totalSteps: steps.length,
        totalDependencies: dependencies.length,
        highRiskSteps: steps.filter(s => s.riskLevel === 'high').length,
        averageComplexity: Math.round(steps.reduce((sum, s) => sum + s.complexityScore, 0) / steps.length)
      }
    };
  }

  private buildTimeline(steps: any[], durationDays: number) {
    const timeline: any[] = [];
    
    for (let day = 1; day <= durationDays; day++) {
      const daySteps = steps.filter(
        step => day >= step.timing.startDay && day <= step.timing.endDay
      );
      
      timeline.push({
        day,
        stepCount: daySteps.length,
        steps: daySteps.map(s => ({
          stepId: s.stepId,
          description: s.description,
          category: s.category,
          timeOfDay: s.timing.timeOfDay,
          riskLevel: s.riskLevel
        }))
      });
    }
    
    return timeline;
  }

  private analyzeComplexity(steps: any[], dependencies: any[], carePlan: any) {
    // Implementation from API route
    const stepCount = steps.length;
    const dependencyDepth = this.calculateMaxDependencyDepth(dependencies);
    const concurrentActivities = this.calculateMaxConcurrentSteps(steps);
    
    const stepComplexity = Math.min((stepCount / 20) * 30, 30);
    const dependencyComplexity = Math.min((dependencyDepth / 5) * 35, 35);
    const concurrencyComplexity = Math.min((concurrentActivities / 10) * 35, 35);
    
    const overallScore = Math.round(stepComplexity + dependencyComplexity + concurrencyComplexity);
    
    return {
      overallScore,
      level: overallScore < 33 ? 'low' : overallScore < 66 ? 'moderate' : 'high',
      factors: { stepCount, dependencyDepth, concurrentActivities }
    };
  }

  private calculateMaxDependencyDepth(dependencies: any[]): number {
    if (dependencies.length === 0) return 0;
    const graph: { [key: string]: string[] } = {};
    dependencies.forEach(dep => {
      if (!graph[dep.sourceStepId]) graph[dep.sourceStepId] = [];
      graph[dep.sourceStepId].push(dep.targetStepId);
    });
    let maxDepth = 0;
    const visited = new Set<string>();
    const dfs = (node: string, depth: number) => {
      if (visited.has(node)) return;
      visited.add(node);
      maxDepth = Math.max(maxDepth, depth);
      if (graph[node]) graph[node].forEach(child => dfs(child, depth + 1));
    };
    Object.keys(graph).forEach(node => { visited.clear(); dfs(node, 1); });
    return maxDepth;
  }

  private calculateMaxConcurrentSteps(steps: any[]): number {
    const daySteps: { [key: number]: number } = {};
    steps.forEach(step => {
      for (let day = step.timing.startDay; day <= step.timing.endDay; day++) {
        daySteps[day] = (daySteps[day] || 0) + 1;
      }
    });
    return Math.max(...Object.values(daySteps), 0);
  }
}

export const journeyService = new JourneyService();