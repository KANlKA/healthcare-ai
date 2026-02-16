import CareStep from '@/models/CareStep';
import RiskMetadata from '@/models/RiskMetadata';
import Dependency from '@/models/Dependency';
import connectDB from '@/lib/mongodb';

class RiskService {
  async getRiskAssessment(stepId: string) {
    await connectDB();

    const [step, riskData, dependencies] = await Promise.all([
      CareStep.findOne({ stepId }).lean(),
      RiskMetadata.findOne({ stepId }).lean(),
      Dependency.find({ $or: [{ sourceStepId: stepId }, { targetStepId: stepId }] }).lean()
    ]);

    if (!step) return null;

    return {
      stepId,
      stepDescription: step.description,
      riskLevel: step.riskLevel,
      riskType: riskData?.riskType || 'general',
      impactScore: this.calculateImpactScore(step, dependencies),
      consequenceDescription: riskData?.consequenceDescription,
      mitigationGuidance: riskData?.mitigationGuidance
    };
  }

  private calculateImpactScore(step: any, dependencies: any[]): number {
    let score = 0;
    if (step.riskLevel === 'high') score += 40;
    else if (step.riskLevel === 'medium') score += 25;
    else score += 10;
    score += Math.min(dependencies.filter(d => d.sourceStepId === step.stepId).length * 10, 30);
    if (step.category === 'medication') score += 20;
    return Math.min(score, 100);
  }
}

export const riskService = new RiskService();