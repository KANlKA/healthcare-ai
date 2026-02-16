import Dependency from '@/models/Dependency';
import CareStep from '@/models/CareStep';
import connectDB from '@/lib/mongodb';

class DependencyService {
  async getDependenciesForCarePlan(carePlanId: string) {
    await connectDB();
    return await Dependency.find({ carePlanId }).lean();
  }

  async getDependenciesForStep(stepId: string) {
    await connectDB();
    const [prerequisites, dependents] = await Promise.all([
      Dependency.find({ sourceStepId: stepId }).lean(),
      Dependency.find({ targetStepId: stepId }).lean()
    ]);
    return { prerequisites, dependents };
  }

  async buildDependencyGraph(carePlanId: string) {
    await connectDB();
    const [steps, dependencies] = await Promise.all([
      CareStep.find({ carePlanId }).select('stepId description category').lean(),
      Dependency.find({ carePlanId }).lean()
    ]);

    const nodes = steps.map(s => ({ id: s.stepId, label: s.description, category: s.category }));
    const edges = dependencies.map(d => ({
      source: d.targetStepId,
      target: d.sourceStepId,
      type: d.dependencyType,
      criticality: d.criticality
    }));

    return { nodes, edges };
  }
}

export const dependencyService = new DependencyService();