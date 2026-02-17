// scripts/seed-database.ts
// COMPLETE SEED - All profiles with full care steps
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

// ─── Inline Schemas ───────────────────────────────────────────────────────────
const ProfileSchema = new mongoose.Schema({
  profileId: { type: String, required: true, unique: true },
  name: String, age: Number, gender: String,
  scenarioDescription: String, carePlanId: String,
  complexityLevel: String, languagePreference: { type: String, default: 'en' },
  literacyLevel: String, syntheticDataMarker: { type: Boolean, default: true },
  tags: [String]
}, { timestamps: true });

const CarePlanSchema = new mongoose.Schema({
  templateId: { type: String, required: true, unique: true },
  scenarioName: String, description: String, durationDays: Number,
  targetPersonas: [String], educationalObjectives: [String],
  complexityMetrics: {
    overallScore: Number, stepCount: Number,
    avgDependencyDepth: Number, concurrentActivities: Number
  },
  stepsOrder: [String],
  dependencyGraph: { nodes: [{ id: String, label: String }], edges: [{ source: String, target: String, type: String }] },
  tags: [String], status: { type: String, default: 'active' }
}, { timestamps: true });

const CareStepSchema = new mongoose.Schema({
  stepId: { type: String, required: true, unique: true },
  carePlanId: String, description: String, medicalContext: String,
  timing: { frequency: String, timeOfDay: [String], duration: Number, startDay: Number, endDay: Number },
  category: String, instructions: String, dependencies: [String],
  riskLevel: String, complexityScore: Number,
  metadata: { estimatedTime: Number, requiredSupplies: [String], warningFlags: [String] }
}, { timestamps: true });

const DependencySchema = new mongoose.Schema({
  dependencyId: { type: String, required: true, unique: true },
  sourceStepId: String, targetStepId: String,
  dependencyType: String, explanation: String,
  criticality: String, carePlanId: String
}, { timestamps: true });

const RiskSchema = new mongoose.Schema({
  stepId: { type: String, required: true, unique: true },
  riskLevel: String, riskType: String,
  consequenceDescription: String, mitigationGuidance: String,
  disclaimer: String,
  impactFactors: { adherenceImportance: Number, consequenceSeverity: Number, reversibility: String }
}, { timestamps: true });

// ─── Seed Data ────────────────────────────────────────────────────────────────
const CARE_PLANS = [
  {
    templateId: 'template_knee_001',
    scenarioName: 'Post-Knee Replacement Recovery',
    description: 'Comprehensive 90-day recovery plan following total knee replacement surgery',
    durationDays: 90,
    targetPersonas: ['patient', 'caregiver'],
    educationalObjectives: ['Understand recovery timeline', 'Learn pain management', 'Practice safe mobilization'],
    complexityMetrics: { overallScore: 62, stepCount: 8, avgDependencyDepth: 3, concurrentActivities: 4 },
    stepsOrder: ['step_knee_001','step_knee_002','step_knee_003','step_knee_004','step_knee_005','step_knee_006','step_knee_007','step_knee_008'],
    dependencyGraph: { nodes: [], edges: [] },
    tags: ['surgery', 'orthopedic', 'rehabilitation'], status: 'active'
  },
  {
    templateId: 'template_diabetes_001',
    scenarioName: 'Type 2 Diabetes Management',
    description: 'Ongoing 180-day diabetes management for newly diagnosed patient',
    durationDays: 180,
    targetPersonas: ['patient', 'caregiver'],
    educationalObjectives: ['Understand glucose monitoring', 'Learn medication adherence', 'Adopt lifestyle changes'],
    complexityMetrics: { overallScore: 78, stepCount: 8, avgDependencyDepth: 4, concurrentActivities: 6 },
    stepsOrder: ['step_dm_001','step_dm_002','step_dm_003','step_dm_004','step_dm_005','step_dm_006','step_dm_007','step_dm_008'],
    dependencyGraph: { nodes: [], edges: [] },
    tags: ['chronic-condition', 'diabetes', 'lifestyle'], status: 'active'
  },
  {
    templateId: 'template_cardiac_001',
    scenarioName: 'Cardiac Rehabilitation',
    description: '12-week cardiac rehabilitation program following heart attack',
    durationDays: 84,
    targetPersonas: ['patient', 'caregiver'],
    educationalObjectives: ['Understand cardiac recovery', 'Learn safe exercise', 'Manage risk factors'],
    complexityMetrics: { overallScore: 85, stepCount: 9, avgDependencyDepth: 5, concurrentActivities: 7 },
    stepsOrder: ['step_cardiac_001','step_cardiac_002','step_cardiac_003','step_cardiac_004','step_cardiac_005','step_cardiac_006','step_cardiac_007','step_cardiac_008','step_cardiac_009'],
    dependencyGraph: { nodes: [], edges: [] },
    tags: ['cardiac', 'rehabilitation', 'exercise'], status: 'active'
  },
  {
    templateId: 'template_hypertension_001',
    scenarioName: 'Hypertension Management',
    description: '90-day blood pressure management with lifestyle changes',
    durationDays: 90,
    targetPersonas: ['patient'],
    educationalObjectives: ['Monitor blood pressure', 'Reduce sodium', 'Increase activity'],
    complexityMetrics: { overallScore: 35, stepCount: 6, avgDependencyDepth: 2, concurrentActivities: 3 },
    stepsOrder: ['step_htn_001','step_htn_002','step_htn_003','step_htn_004','step_htn_005','step_htn_006'],
    dependencyGraph: { nodes: [], edges: [] },
    tags: ['hypertension', 'chronic-condition', 'lifestyle'], status: 'active'
  },
  {
    templateId: 'template_asthma_001',
    scenarioName: 'Asthma Control Program',
    description: '6-month asthma monitoring and management program',
    durationDays: 180,
    targetPersonas: ['patient', 'caregiver'],
    educationalObjectives: ['Identify triggers', 'Learn inhaler technique', 'Recognize warning signs'],
    complexityMetrics: { overallScore: 50, stepCount: 7, avgDependencyDepth: 3, concurrentActivities: 4 },
    stepsOrder: ['step_asthma_001','step_asthma_002','step_asthma_003','step_asthma_004','step_asthma_005','step_asthma_006','step_asthma_007'],
    dependencyGraph: { nodes: [], edges: [] },
    tags: ['asthma', 'respiratory', 'monitoring'], status: 'active'
  }
];

const PROFILES = [
  {
    profileId: 'profile_001', name: 'Alex Johnson (Synthetic)',
    age: 45, gender: 'Non-binary',
    scenarioDescription: 'Post-surgical recovery following total knee replacement',
    carePlanId: 'template_knee_001', complexityLevel: 'moderate',
    literacyLevel: 'intermediate', syntheticDataMarker: true,
    tags: ['surgery', 'orthopedic', 'rehabilitation']
  },
  {
    profileId: 'profile_002', name: 'Maria Garcia (Synthetic)',
    age: 62, gender: 'Female',
    scenarioDescription: 'Newly diagnosed Type 2 diabetes requiring lifestyle and medication management',
    carePlanId: 'template_diabetes_001', complexityLevel: 'high',
    literacyLevel: 'basic', syntheticDataMarker: true,
    tags: ['chronic-condition', 'diabetes', 'lifestyle']
  },
  {
    profileId: 'profile_003', name: 'Robert Chen (Synthetic)',
    age: 58, gender: 'Male',
    scenarioDescription: 'Cardiac rehabilitation following myocardial infarction',
    carePlanId: 'template_cardiac_001', complexityLevel: 'high',
    literacyLevel: 'intermediate', syntheticDataMarker: true,
    tags: ['cardiac', 'rehabilitation', 'exercise']
  },
  {
    profileId: 'profile_004', name: 'Priya Patel (Synthetic)',
    age: 38, gender: 'Female',
    scenarioDescription: 'Hypertension management with diet and lifestyle modifications',
    carePlanId: 'template_hypertension_001', complexityLevel: 'low',
    literacyLevel: 'advanced', syntheticDataMarker: true,
    tags: ['hypertension', 'chronic-condition', 'lifestyle']
  },
  {
    profileId: 'profile_005', name: 'James Williams (Synthetic)',
    age: 29, gender: 'Male',
    scenarioDescription: 'Moderate asthma management and trigger avoidance program',
    carePlanId: 'template_asthma_001', complexityLevel: 'moderate',
    literacyLevel: 'intermediate', syntheticDataMarker: true,
    tags: ['asthma', 'respiratory', 'monitoring']
  }
];

const CARE_STEPS = [
  // ── KNEE (8 steps) ───────────────────────────────────────────────────────────
  {
    stepId: 'step_knee_001', carePlanId: 'template_knee_001',
    description: 'Take prescribed pain medication',
    medicalContext: 'Post-surgical pain management to support recovery and enable participation in therapy',
    timing: { frequency: 'twice daily', timeOfDay: ['morning', 'evening'], startDay: 1, endDay: 14, duration: 5 },
    category: 'medication', instructions: 'Take with food. Do not exceed prescribed dose.',
    dependencies: [], riskLevel: 'high', complexityScore: 70,
    metadata: { estimatedTime: 5, requiredSupplies: ['medication', 'water'], warningFlags: ['Do not drive after taking'] }
  },
  {
    stepId: 'step_knee_002', carePlanId: 'template_knee_001',
    description: 'Perform knee flexion and extension exercises',
    medicalContext: 'Restoring range of motion is the primary goal of early post-surgical rehabilitation',
    timing: { frequency: 'three times daily', timeOfDay: ['morning', 'afternoon', 'evening'], startDay: 2, endDay: 90, duration: 20 },
    category: 'exercise', instructions: 'Bend and straighten knee slowly. Stop if sharp pain occurs.',
    dependencies: ['step_knee_001'], riskLevel: 'medium', complexityScore: 55,
    metadata: { estimatedTime: 20, requiredSupplies: [], warningFlags: ['Stop if sharp pain'] }
  },
  {
    stepId: 'step_knee_003', carePlanId: 'template_knee_001',
    description: 'Apply ice pack to surgical site',
    medicalContext: 'Cold therapy reduces post-surgical swelling and provides natural pain relief',
    timing: { frequency: 'four times daily', timeOfDay: ['morning', 'afternoon', 'evening', 'night'], startDay: 1, endDay: 14, duration: 15 },
    category: 'monitoring', instructions: 'Apply 15 minutes on, 15 minutes off. Always use a cloth barrier.',
    dependencies: [], riskLevel: 'low', complexityScore: 25,
    metadata: { estimatedTime: 15, requiredSupplies: ['ice pack', 'cloth'], warningFlags: ['Never apply ice directly to skin'] }
  },
  {
    stepId: 'step_knee_004', carePlanId: 'template_knee_001',
    description: 'Attend physical therapy session',
    medicalContext: 'Professional supervision ensures safe progression of strength and mobility exercises',
    timing: { frequency: 'three times weekly', timeOfDay: ['morning'], startDay: 7, endDay: 84, duration: 60 },
    category: 'appointment', instructions: 'Bring comfortable clothes. Report any new pain to therapist.',
    dependencies: ['step_knee_002'], riskLevel: 'medium', complexityScore: 60,
    metadata: { estimatedTime: 60, requiredSupplies: ['comfortable shoes', 'water bottle'], warningFlags: [] }
  },
  {
    stepId: 'step_knee_005', carePlanId: 'template_knee_001',
    description: 'Inspect and dress surgical wound',
    medicalContext: 'Daily wound monitoring enables early detection of infection or healing complications',
    timing: { frequency: 'once daily', timeOfDay: ['morning'], startDay: 1, endDay: 21, duration: 15 },
    category: 'monitoring', instructions: 'Check for redness, warmth, swelling, or discharge. Change dressing as instructed.',
    dependencies: [], riskLevel: 'high', complexityScore: 65,
    metadata: { estimatedTime: 15, requiredSupplies: ['dressing kit', 'gloves'], warningFlags: ['Contact doctor if signs of infection appear'] }
  },
  {
    stepId: 'step_knee_006', carePlanId: 'template_knee_001',
    description: 'Practice walking with assistive device',
    medicalContext: 'Gradual weight bearing with support promotes safe healing and prevents muscle atrophy',
    timing: { frequency: 'twice daily', timeOfDay: ['morning', 'afternoon'], startDay: 2, endDay: 30, duration: 15 },
    category: 'exercise', instructions: 'Use walker or crutches as directed. Follow weight-bearing instructions exactly.',
    dependencies: ['step_knee_001'], riskLevel: 'medium', complexityScore: 50,
    metadata: { estimatedTime: 15, requiredSupplies: ['walker or crutches'], warningFlags: ['Do not bear full weight without medical clearance'] }
  },
  {
    stepId: 'step_knee_007', carePlanId: 'template_knee_001',
    description: 'Elevate leg when resting',
    medicalContext: 'Elevation above heart level uses gravity to reduce post-surgical swelling',
    timing: { frequency: 'multiple times daily', timeOfDay: ['morning', 'afternoon', 'evening'], startDay: 1, endDay: 30, duration: 30 },
    category: 'lifestyle', instructions: 'Elevate leg above heart level using pillows when resting.',
    dependencies: [], riskLevel: 'low', complexityScore: 20,
    metadata: { estimatedTime: 30, requiredSupplies: ['pillows'], warningFlags: [] }
  },
  {
    stepId: 'step_knee_008', carePlanId: 'template_knee_001',
    description: 'Surgeon follow-up appointment',
    medicalContext: 'Regular medical reviews allow the surgeon to monitor healing and adjust the care plan',
    timing: { frequency: 'every 2 weeks', timeOfDay: ['morning'], startDay: 14, endDay: 90, duration: 30 },
    category: 'appointment', instructions: 'Bring medication list and pain diary. Report any concerns.',
    dependencies: ['step_knee_005'], riskLevel: 'low', complexityScore: 40,
    metadata: { estimatedTime: 30, requiredSupplies: ['insurance card', 'medication list'], warningFlags: [] }
  },

  // ── DIABETES (8 steps) ───────────────────────────────────────────────────────
  {
    stepId: 'step_dm_001', carePlanId: 'template_diabetes_001',
    description: 'Check fasting blood glucose in the morning',
    medicalContext: 'Fasting glucose measurement reveals overnight glucose patterns and medication effectiveness',
    timing: { frequency: 'once daily', timeOfDay: ['morning'], startDay: 1, endDay: 180, duration: 5 },
    category: 'monitoring', instructions: 'Test before eating anything. Record result in glucose log.',
    dependencies: [], riskLevel: 'high', complexityScore: 60,
    metadata: { estimatedTime: 5, requiredSupplies: ['glucose meter', 'test strips', 'lancets', 'log book'], warningFlags: ['Call doctor if reading over 300 or under 70'] }
  },
  {
    stepId: 'step_dm_002', carePlanId: 'template_diabetes_001',
    description: 'Take morning diabetes medication',
    medicalContext: 'Oral hypoglycemic medication helps cells use glucose more effectively throughout the day',
    timing: { frequency: 'once daily', timeOfDay: ['morning'], startDay: 1, endDay: 180, duration: 5 },
    category: 'medication', instructions: 'Take with breakfast at the same time every day. Never skip a dose.',
    dependencies: ['step_dm_001'], riskLevel: 'high', complexityScore: 75,
    metadata: { estimatedTime: 5, requiredSupplies: ['medication'], warningFlags: ['Take with food', 'Never skip doses'] }
  },
  {
    stepId: 'step_dm_003', carePlanId: 'template_diabetes_001',
    description: 'Check post-meal blood glucose',
    medicalContext: 'Post-meal readings show how food choices affect blood sugar levels',
    timing: { frequency: 'twice daily', timeOfDay: ['afternoon', 'evening'], startDay: 1, endDay: 180, duration: 5 },
    category: 'monitoring', instructions: 'Test 2 hours after main meals. Record all results.',
    dependencies: [], riskLevel: 'medium', complexityScore: 50,
    metadata: { estimatedTime: 5, requiredSupplies: ['glucose meter', 'test strips'], warningFlags: [] }
  },
  {
    stepId: 'step_dm_004', carePlanId: 'template_diabetes_001',
    description: '30-minute moderate exercise session',
    medicalContext: 'Physical activity improves insulin sensitivity and directly lowers blood glucose levels',
    timing: { frequency: 'once daily', timeOfDay: ['afternoon'], startDay: 7, endDay: 180, duration: 30 },
    category: 'exercise', instructions: 'Check glucose before exercising. Carry fast-acting sugar (juice, glucose tablets).',
    dependencies: ['step_dm_001'], riskLevel: 'medium', complexityScore: 55,
    metadata: { estimatedTime: 30, requiredSupplies: ['comfortable shoes', 'glucose tablets', 'water'], warningFlags: ['Do not exercise if glucose below 100 mg/dL'] }
  },
  {
    stepId: 'step_dm_005', carePlanId: 'template_diabetes_001',
    description: 'Follow prescribed diabetic meal plan',
    medicalContext: 'Consistent carbohydrate portions at regular intervals maintain stable blood glucose',
    timing: { frequency: 'three times daily', timeOfDay: ['morning', 'afternoon', 'evening'], startDay: 1, endDay: 180, duration: 30 },
    category: 'lifestyle', instructions: 'Eat meals at consistent times. Follow carbohydrate portion guidelines.',
    dependencies: [], riskLevel: 'high', complexityScore: 70,
    metadata: { estimatedTime: 30, requiredSupplies: ['meal plan', 'measuring cups'], warningFlags: [] }
  },
  {
    stepId: 'step_dm_006', carePlanId: 'template_diabetes_001',
    description: 'Daily foot inspection',
    medicalContext: 'Diabetes reduces nerve sensation in feet, making daily inspection critical to catch wounds early',
    timing: { frequency: 'once daily', timeOfDay: ['bedtime'], startDay: 1, endDay: 180, duration: 10 },
    category: 'monitoring', instructions: 'Check soles and between toes. Use a mirror if needed. Contact doctor for any sores.',
    dependencies: [], riskLevel: 'high', complexityScore: 65,
    metadata: { estimatedTime: 10, requiredSupplies: ['mirror (optional)'], warningFlags: ['Any wound requires same-day doctor contact'] }
  },
  {
    stepId: 'step_dm_007', carePlanId: 'template_diabetes_001',
    description: 'Endocrinologist appointment',
    medicalContext: 'Regular specialist reviews track long-term glucose control and prevent complications',
    timing: { frequency: 'monthly', timeOfDay: ['morning'], startDay: 30, endDay: 180, duration: 45 },
    category: 'appointment', instructions: 'Bring glucose log. Have HbA1c and blood pressure checked.',
    dependencies: ['step_dm_001', 'step_dm_003'], riskLevel: 'medium', complexityScore: 45,
    metadata: { estimatedTime: 45, requiredSupplies: ['glucose log', 'medication list'], warningFlags: [] }
  },
  {
    stepId: 'step_dm_008', carePlanId: 'template_diabetes_001',
    description: 'Diabetes education class',
    medicalContext: 'Structured education improves understanding of diabetes self-management',
    timing: { frequency: 'weekly', timeOfDay: ['morning'], startDay: 7, endDay: 84, duration: 90 },
    category: 'appointment', instructions: 'Attend all sessions. Bring questions. Take notes.',
    dependencies: [], riskLevel: 'low', complexityScore: 30,
    metadata: { estimatedTime: 90, requiredSupplies: ['notebook', 'pen'], warningFlags: [] }
  },

  // ── CARDIAC (9 steps) ────────────────────────────────────────────────────────
  {
    stepId: 'step_cardiac_001', carePlanId: 'template_cardiac_001',
    description: 'Take daily cardiac medications',
    medicalContext: 'Beta-blockers, statins and aspirin reduce risk of further cardiac events after heart attack',
    timing: { frequency: 'twice daily', timeOfDay: ['morning', 'evening'], startDay: 1, endDay: 84, duration: 5 },
    category: 'medication', instructions: 'Take at the same times daily. Never stop without consulting doctor.',
    dependencies: [], riskLevel: 'high', complexityScore: 80,
    metadata: { estimatedTime: 5, requiredSupplies: ['medications', 'pill organizer'], warningFlags: ['Never stop cardiac medications abruptly'] }
  },
  {
    stepId: 'step_cardiac_002', carePlanId: 'template_cardiac_001',
    description: 'Monitor daily blood pressure and heart rate',
    medicalContext: 'Tracking vital signs helps detect dangerous changes early and assess medication effectiveness',
    timing: { frequency: 'twice daily', timeOfDay: ['morning', 'evening'], startDay: 1, endDay: 84, duration: 10 },
    category: 'monitoring', instructions: 'Measure at rest, sitting quietly for 5 minutes first. Record both readings.',
    dependencies: [], riskLevel: 'high', complexityScore: 70,
    metadata: { estimatedTime: 10, requiredSupplies: ['blood pressure monitor'], warningFlags: ['Call doctor if BP above 180/120 or heart rate above 120'] }
  },
  {
    stepId: 'step_cardiac_003', carePlanId: 'template_cardiac_001',
    description: 'Attend supervised cardiac exercise session',
    medicalContext: 'Medically supervised exercise progressively strengthens the heart in a safe environment',
    timing: { frequency: 'three times weekly', timeOfDay: ['morning'], startDay: 14, endDay: 84, duration: 60 },
    category: 'exercise', instructions: 'Wear heart rate monitor. Stay within prescribed heart rate zone.',
    dependencies: ['step_cardiac_001', 'step_cardiac_002'], riskLevel: 'high', complexityScore: 85,
    metadata: { estimatedTime: 60, requiredSupplies: ['comfortable clothes', 'heart rate monitor', 'water'], warningFlags: ['Stop immediately if chest pain, dizziness, or shortness of breath'] }
  },
  {
    stepId: 'step_cardiac_004', carePlanId: 'template_cardiac_001',
    description: 'Follow heart-healthy diet',
    medicalContext: 'Low sodium, low saturated fat diet reduces strain on the heart and prevents further blockages',
    timing: { frequency: 'three times daily', timeOfDay: ['morning', 'afternoon', 'evening'], startDay: 1, endDay: 84, duration: 30 },
    category: 'lifestyle', instructions: 'Limit sodium to 2,000mg/day. Avoid saturated fats and processed foods.',
    dependencies: [], riskLevel: 'medium', complexityScore: 60,
    metadata: { estimatedTime: 30, requiredSupplies: ['diet guide', 'food scale'], warningFlags: [] }
  },
  {
    stepId: 'step_cardiac_005', carePlanId: 'template_cardiac_001',
    description: 'Daily gentle walking',
    medicalContext: 'Low-intensity walking builds cardiovascular endurance safely during early recovery',
    timing: { frequency: 'once daily', timeOfDay: ['morning'], startDay: 7, endDay: 84, duration: 20 },
    category: 'exercise', instructions: 'Start with 10 minutes and gradually increase. Stop if any chest discomfort.',
    dependencies: ['step_cardiac_002'], riskLevel: 'medium', complexityScore: 55,
    metadata: { estimatedTime: 20, requiredSupplies: ['comfortable shoes', 'phone'], warningFlags: ['Stop if chest pain or severe breathlessness'] }
  },
  {
    stepId: 'step_cardiac_006', carePlanId: 'template_cardiac_001',
    description: 'Cardiologist follow-up appointment',
    medicalContext: 'Specialist monitoring tracks cardiac recovery and adjusts medications as needed',
    timing: { frequency: 'every 2 weeks', timeOfDay: ['morning'], startDay: 14, endDay: 84, duration: 45 },
    category: 'appointment', instructions: 'Bring BP log and any symptom diary. Report all side effects.',
    dependencies: ['step_cardiac_002'], riskLevel: 'medium', complexityScore: 50,
    metadata: { estimatedTime: 45, requiredSupplies: ['BP log', 'medication list'], warningFlags: [] }
  },
  {
    stepId: 'step_cardiac_007', carePlanId: 'template_cardiac_001',
    description: 'Stress management and relaxation practice',
    medicalContext: 'Chronic stress increases blood pressure and cardiac strain, hindering recovery',
    timing: { frequency: 'once daily', timeOfDay: ['evening'], startDay: 1, endDay: 84, duration: 20 },
    category: 'lifestyle', instructions: 'Practice deep breathing, meditation, or guided relaxation for 20 minutes.',
    dependencies: [], riskLevel: 'low', complexityScore: 30,
    metadata: { estimatedTime: 20, requiredSupplies: ['relaxation app or audio (optional)'], warningFlags: [] }
  },
  {
    stepId: 'step_cardiac_008', carePlanId: 'template_cardiac_001',
    description: 'Weigh yourself and monitor for fluid retention',
    medicalContext: 'Rapid weight gain can indicate fluid retention, a sign of heart failure requiring urgent attention',
    timing: { frequency: 'once daily', timeOfDay: ['morning'], startDay: 1, endDay: 84, duration: 5 },
    category: 'monitoring', instructions: 'Weigh at same time each morning after using bathroom. Record weight daily.',
    dependencies: [], riskLevel: 'high', complexityScore: 65,
    metadata: { estimatedTime: 5, requiredSupplies: ['scale', 'log book'], warningFlags: ['Call doctor if weight increases more than 2kg in 2 days'] }
  },
  {
    stepId: 'step_cardiac_009', carePlanId: 'template_cardiac_001',
    description: 'Cardiac education and counseling session',
    medicalContext: 'Understanding heart disease risk factors empowers patients to make lasting lifestyle changes',
    timing: { frequency: 'weekly', timeOfDay: ['afternoon'], startDay: 7, endDay: 84, duration: 60 },
    category: 'appointment', instructions: 'Attend all sessions. Bring family member if possible.',
    dependencies: [], riskLevel: 'low', complexityScore: 35,
    metadata: { estimatedTime: 60, requiredSupplies: ['notebook'], warningFlags: [] }
  },

  // ── HYPERTENSION (6 steps) ───────────────────────────────────────────────────
  {
    stepId: 'step_htn_001', carePlanId: 'template_hypertension_001',
    description: 'Take prescribed blood pressure medication',
    medicalContext: 'Antihypertensive medication keeps blood pressure within safe limits and protects organs',
    timing: { frequency: 'once daily', timeOfDay: ['morning'], startDay: 1, endDay: 90, duration: 5 },
    category: 'medication', instructions: 'Take at the same time each morning. Do not skip doses.',
    dependencies: [], riskLevel: 'high', complexityScore: 65,
    metadata: { estimatedTime: 5, requiredSupplies: ['medication'], warningFlags: ['Never stop without doctor approval'] }
  },
  {
    stepId: 'step_htn_002', carePlanId: 'template_hypertension_001',
    description: 'Measure and record blood pressure',
    medicalContext: 'Home monitoring provides more accurate data than clinic readings and tracks treatment progress',
    timing: { frequency: 'twice daily', timeOfDay: ['morning', 'evening'], startDay: 1, endDay: 90, duration: 10 },
    category: 'monitoring', instructions: 'Sit quietly for 5 minutes before measuring. Take 2 readings, record both.',
    dependencies: [], riskLevel: 'medium', complexityScore: 45,
    metadata: { estimatedTime: 10, requiredSupplies: ['blood pressure monitor', 'log book'], warningFlags: ['Seek care if consistently above 160/100'] }
  },
  {
    stepId: 'step_htn_003', carePlanId: 'template_hypertension_001',
    description: '30-minute aerobic exercise',
    medicalContext: 'Regular aerobic exercise naturally lowers blood pressure by 5-8mmHg over time',
    timing: { frequency: 'once daily', timeOfDay: ['morning'], startDay: 1, endDay: 90, duration: 30 },
    category: 'exercise', instructions: 'Brisk walking, cycling, or swimming. Keep intensity moderate.',
    dependencies: [], riskLevel: 'low', complexityScore: 40,
    metadata: { estimatedTime: 30, requiredSupplies: ['comfortable shoes'], warningFlags: [] }
  },
  {
    stepId: 'step_htn_004', carePlanId: 'template_hypertension_001',
    description: 'Follow low-sodium diet',
    medicalContext: 'Reducing sodium intake lowers blood pressure by decreasing fluid retention and vessel strain',
    timing: { frequency: 'three times daily', timeOfDay: ['morning', 'afternoon', 'evening'], startDay: 1, endDay: 90, duration: 20 },
    category: 'lifestyle', instructions: 'Limit sodium to under 2,300mg/day. Read food labels.',
    dependencies: [], riskLevel: 'medium', complexityScore: 50,
    metadata: { estimatedTime: 20, requiredSupplies: ['diet guide'], warningFlags: [] }
  },
  {
    stepId: 'step_htn_005', carePlanId: 'template_hypertension_001',
    description: 'Limit alcohol and avoid smoking',
    medicalContext: 'Alcohol and tobacco significantly raise blood pressure and increase cardiovascular risk',
    timing: { frequency: 'ongoing daily', timeOfDay: ['morning'], startDay: 1, endDay: 90, duration: 5 },
    category: 'lifestyle', instructions: 'No more than 1 drink per day for women, 2 for men. Avoid all smoking.',
    dependencies: [], riskLevel: 'medium', complexityScore: 45,
    metadata: { estimatedTime: 5, requiredSupplies: [], warningFlags: [] }
  },
  {
    stepId: 'step_htn_006', carePlanId: 'template_hypertension_001',
    description: 'GP review appointment',
    medicalContext: 'Regular reviews allow medication adjustment based on home BP readings and side effects',
    timing: { frequency: 'monthly', timeOfDay: ['morning'], startDay: 30, endDay: 90, duration: 30 },
    category: 'appointment', instructions: 'Bring full BP log. Report any dizziness or side effects.',
    dependencies: ['step_htn_002'], riskLevel: 'low', complexityScore: 35,
    metadata: { estimatedTime: 30, requiredSupplies: ['BP log', 'medication list'], warningFlags: [] }
  },

  // ── ASTHMA (7 steps) ─────────────────────────────────────────────────────────
  {
    stepId: 'step_asthma_001', carePlanId: 'template_asthma_001',
    description: 'Use daily preventer inhaler',
    medicalContext: 'Preventer inhaler reduces airway inflammation to prevent asthma attacks',
    timing: { frequency: 'twice daily', timeOfDay: ['morning', 'evening'], startDay: 1, endDay: 180, duration: 5 },
    category: 'medication', instructions: 'Use every morning and evening even when feeling well. Rinse mouth after use.',
    dependencies: [], riskLevel: 'high', complexityScore: 70,
    metadata: { estimatedTime: 5, requiredSupplies: ['preventer inhaler', 'spacer'], warningFlags: ['Do not skip even on good days'] }
  },
  {
    stepId: 'step_asthma_002', carePlanId: 'template_asthma_001',
    description: 'Measure peak flow reading',
    medicalContext: 'Peak flow monitoring detects airway narrowing before symptoms become severe',
    timing: { frequency: 'twice daily', timeOfDay: ['morning', 'evening'], startDay: 1, endDay: 180, duration: 5 },
    category: 'monitoring', instructions: 'Take 3 readings and record the best. Use before inhaler in the morning.',
    dependencies: [], riskLevel: 'medium', complexityScore: 55,
    metadata: { estimatedTime: 5, requiredSupplies: ['peak flow meter', 'diary'], warningFlags: ['If below 50% personal best - seek emergency care'] }
  },
  {
    stepId: 'step_asthma_003', carePlanId: 'template_asthma_001',
    description: 'Identify and avoid asthma triggers',
    medicalContext: 'Trigger avoidance is the most effective strategy for preventing asthma episodes',
    timing: { frequency: 'ongoing daily', timeOfDay: ['morning'], startDay: 1, endDay: 180, duration: 10 },
    category: 'lifestyle', instructions: 'Check air quality, pollen counts, and dust levels. Avoid known triggers.',
    dependencies: [], riskLevel: 'medium', complexityScore: 50,
    metadata: { estimatedTime: 10, requiredSupplies: ['air quality app'], warningFlags: [] }
  },
  {
    stepId: 'step_asthma_004', carePlanId: 'template_asthma_001',
    description: 'Keep rescue inhaler accessible at all times',
    medicalContext: 'Reliever inhaler must be immediately available to treat acute asthma attacks',
    timing: { frequency: 'ongoing daily', timeOfDay: ['morning'], startDay: 1, endDay: 180, duration: 5 },
    category: 'lifestyle', instructions: 'Carry rescue inhaler at all times. Check it is not expired monthly.',
    dependencies: [], riskLevel: 'high', complexityScore: 60,
    metadata: { estimatedTime: 5, requiredSupplies: ['rescue inhaler'], warningFlags: ['Never leave home without rescue inhaler'] }
  },
  {
    stepId: 'step_asthma_005', carePlanId: 'template_asthma_001',
    description: 'Breathing exercises and respiratory physiotherapy',
    medicalContext: 'Breathing technique training improves lung efficiency and reduces asthma symptoms',
    timing: { frequency: 'once daily', timeOfDay: ['morning'], startDay: 7, endDay: 180, duration: 15 },
    category: 'exercise', instructions: 'Practice pursed lip breathing and diaphragmatic breathing for 15 minutes.',
    dependencies: [], riskLevel: 'low', complexityScore: 35,
    metadata: { estimatedTime: 15, requiredSupplies: ['instructional guide'], warningFlags: [] }
  },
  {
    stepId: 'step_asthma_006', carePlanId: 'template_asthma_001',
    description: 'Pulmonologist review appointment',
    medicalContext: 'Specialist review assesses asthma control and adjusts treatment plan as needed',
    timing: { frequency: 'every 6 weeks', timeOfDay: ['morning'], startDay: 42, endDay: 180, duration: 45 },
    category: 'appointment', instructions: 'Bring peak flow diary and symptom log. Report any nighttime symptoms.',
    dependencies: ['step_asthma_002'], riskLevel: 'low', complexityScore: 40,
    metadata: { estimatedTime: 45, requiredSupplies: ['peak flow diary', 'inhaler devices'], warningFlags: [] }
  },
  {
    stepId: 'step_asthma_007', carePlanId: 'template_asthma_001',
    description: 'Check and clean inhaler device',
    medicalContext: 'Proper inhaler technique and clean devices ensure medication reaches the lungs correctly',
    timing: { frequency: 'weekly', timeOfDay: ['morning'], startDay: 7, endDay: 180, duration: 10 },
    category: 'monitoring', instructions: 'Clean mouthpiece weekly. Check dose counter. Ensure spacer is clean.',
    dependencies: ['step_asthma_001'], riskLevel: 'low', complexityScore: 25,
    metadata: { estimatedTime: 10, requiredSupplies: ['clean cloth', 'water'], warningFlags: [] }
  }
];

const DEPENDENCIES = [
  { dependencyId: 'dep_knee_001', carePlanId: 'template_knee_001', sourceStepId: 'step_knee_002', targetStepId: 'step_knee_001', dependencyType: 'prerequisite', criticality: 'required', explanation: 'Pain medication should be taken before exercises to ensure comfortable participation in therapy' },
  { dependencyId: 'dep_knee_002', carePlanId: 'template_knee_001', sourceStepId: 'step_knee_004', targetStepId: 'step_knee_002', dependencyType: 'prerequisite', criticality: 'recommended', explanation: 'Basic exercises should be established before attending full physical therapy sessions' },
  { dependencyId: 'dep_knee_003', carePlanId: 'template_knee_001', sourceStepId: 'step_knee_008', targetStepId: 'step_knee_005', dependencyType: 'timing_constraint', criticality: 'required', explanation: 'Wound assessment should occur before surgeon follow-up for accurate reporting' },
  { dependencyId: 'dep_dm_001', carePlanId: 'template_diabetes_001', sourceStepId: 'step_dm_002', targetStepId: 'step_dm_001', dependencyType: 'prerequisite', criticality: 'required', explanation: 'Blood glucose must be checked before taking medication to avoid dangerous low glucose levels' },
  { dependencyId: 'dep_dm_002', carePlanId: 'template_diabetes_001', sourceStepId: 'step_dm_004', targetStepId: 'step_dm_001', dependencyType: 'timing_constraint', criticality: 'required', explanation: 'Blood glucose must be checked before exercise to ensure safe glucose levels for activity' },
  { dependencyId: 'dep_dm_003', carePlanId: 'template_diabetes_001', sourceStepId: 'step_dm_007', targetStepId: 'step_dm_001', dependencyType: 'prerequisite', criticality: 'recommended', explanation: 'Glucose logs should be reviewed with endocrinologist at appointments' },
  { dependencyId: 'dep_cardiac_001', carePlanId: 'template_cardiac_001', sourceStepId: 'step_cardiac_003', targetStepId: 'step_cardiac_001', dependencyType: 'prerequisite', criticality: 'required', explanation: 'Cardiac medications must be taken before supervised exercise sessions' },
  { dependencyId: 'dep_cardiac_002', carePlanId: 'template_cardiac_001', sourceStepId: 'step_cardiac_003', targetStepId: 'step_cardiac_002', dependencyType: 'prerequisite', criticality: 'required', explanation: 'Vital signs must be within safe range before beginning supervised cardiac exercise' },
  { dependencyId: 'dep_cardiac_003', carePlanId: 'template_cardiac_001', sourceStepId: 'step_cardiac_005', targetStepId: 'step_cardiac_002', dependencyType: 'timing_constraint', criticality: 'required', explanation: 'Blood pressure check must precede any exercise to ensure safety' },
  { dependencyId: 'dep_cardiac_004', carePlanId: 'template_cardiac_001', sourceStepId: 'step_cardiac_006', targetStepId: 'step_cardiac_002', dependencyType: 'prerequisite', criticality: 'recommended', explanation: 'BP log should be available for cardiologist review' },
  { dependencyId: 'dep_htn_001', carePlanId: 'template_hypertension_001', sourceStepId: 'step_htn_006', targetStepId: 'step_htn_002', dependencyType: 'prerequisite', criticality: 'recommended', explanation: 'BP log should be reviewed at GP appointments' },
  { dependencyId: 'dep_asthma_001', carePlanId: 'template_asthma_001', sourceStepId: 'step_asthma_006', targetStepId: 'step_asthma_002', dependencyType: 'prerequisite', criticality: 'recommended', explanation: 'Peak flow diary should be reviewed at specialist appointments' },
  { dependencyId: 'dep_asthma_002', carePlanId: 'template_asthma_001', sourceStepId: 'step_asthma_007', targetStepId: 'step_asthma_001', dependencyType: 'timing_constraint', criticality: 'informational', explanation: 'Inhaler devices should be cleaned regularly for effective medication delivery' }
];

const RISK_METADATA = [
  { stepId: 'step_knee_001', riskLevel: 'high', riskType: 'medication_interaction', consequenceDescription: 'Skipping pain medication makes exercises too painful to perform, significantly slowing recovery progress.', mitigationGuidance: 'Set phone alarms for medication times. Keep medication visible as a reminder.', disclaimer: 'Educational only. Consult your healthcare provider.', impactFactors: { adherenceImportance: 9, consequenceSeverity: 7, reversibility: 'reversible' } },
  { stepId: 'step_knee_005', riskLevel: 'high', riskType: 'safety_concern', consequenceDescription: 'Undetected surgical wound infection can rapidly escalate to serious complications requiring additional surgery.', mitigationGuidance: 'Check wound every morning. Know infection signs: increased redness, warmth, swelling, discharge, fever.', disclaimer: 'Educational only. Contact doctor immediately if infection signs appear.', impactFactors: { adherenceImportance: 10, consequenceSeverity: 9, reversibility: 'partially_reversible' } },
  { stepId: 'step_dm_001', riskLevel: 'high', riskType: 'timing_critical', consequenceDescription: 'Without regular monitoring, dangerous glucose highs or lows may go undetected, risking diabetic emergencies.', mitigationGuidance: 'Keep glucose meter on the kitchen counter as a visible reminder. Log all readings consistently.', disclaimer: 'Educational only. Consult your healthcare provider for guidance.', impactFactors: { adherenceImportance: 10, consequenceSeverity: 9, reversibility: 'reversible' } },
  { stepId: 'step_dm_002', riskLevel: 'high', riskType: 'medication_interaction', consequenceDescription: 'Missing diabetes medication disrupts glucose control and can cause sustained high blood sugar damaging organs over time.', mitigationGuidance: 'Use a pill organizer. Take medication at the same time daily with breakfast as a habit cue.', disclaimer: 'Educational only. Never adjust medication without doctor guidance.', impactFactors: { adherenceImportance: 10, consequenceSeverity: 8, reversibility: 'reversible' } },
  { stepId: 'step_dm_006', riskLevel: 'high', riskType: 'safety_concern', consequenceDescription: 'Diabetic neuropathy can mask foot wounds which may progress rapidly to serious infections or ulcers.', mitigationGuidance: 'Make foot inspection part of bedtime routine. Any wound, no matter how small, requires same-day medical contact.', disclaimer: 'Educational only. Any foot wound requires immediate medical attention.', impactFactors: { adherenceImportance: 10, consequenceSeverity: 10, reversibility: 'partially_reversible' } },
  { stepId: 'step_cardiac_001', riskLevel: 'high', riskType: 'medication_interaction', consequenceDescription: 'Stopping cardiac medications suddenly can trigger dangerous arrhythmias or a second heart attack.', mitigationGuidance: 'Use a pill organizer. Never run out - request refills one week before running out.', disclaimer: 'Educational only. Never stop cardiac medications without medical supervision.', impactFactors: { adherenceImportance: 10, consequenceSeverity: 10, reversibility: 'partially_reversible' } },
  { stepId: 'step_cardiac_002', riskLevel: 'high', riskType: 'timing_critical', consequenceDescription: 'Unmonitored blood pressure can reach dangerous levels without warning, increasing risk of stroke.', mitigationGuidance: 'Measure blood pressure at the same times each day. Keep a detailed log for your cardiologist.', disclaimer: 'Educational only. Seek immediate care if BP exceeds 180/120.', impactFactors: { adherenceImportance: 9, consequenceSeverity: 9, reversibility: 'reversible' } },
  { stepId: 'step_cardiac_003', riskLevel: 'high', riskType: 'safety_concern', consequenceDescription: 'Unsupervised high-intensity exercise after heart attack can trigger dangerous cardiac events.', mitigationGuidance: 'Always exercise within prescribed heart rate zones. Never skip warm-up or cool-down.', disclaimer: 'Educational only. Always exercise under medical supervision during early recovery.', impactFactors: { adherenceImportance: 9, consequenceSeverity: 9, reversibility: 'partially_reversible' } },
  { stepId: 'step_cardiac_008', riskLevel: 'high', riskType: 'timing_critical', consequenceDescription: 'Sudden weight gain of 2kg+ in 2 days can indicate dangerous fluid retention requiring urgent cardiac treatment.', mitigationGuidance: 'Weigh at the exact same time each morning. Keep a written log to spot trends.', disclaimer: 'Educational only. Contact doctor immediately for rapid weight gain.', impactFactors: { adherenceImportance: 9, consequenceSeverity: 8, reversibility: 'reversible' } },
  { stepId: 'step_htn_001', riskLevel: 'high', riskType: 'medication_interaction', consequenceDescription: 'Stopping blood pressure medication causes rapid return of hypertension, increasing stroke and kidney damage risk.', mitigationGuidance: 'Link medication to a consistent daily habit like morning coffee or brushing teeth.', disclaimer: 'Educational only. Never stop without consulting your doctor.', impactFactors: { adherenceImportance: 10, consequenceSeverity: 8, reversibility: 'reversible' } },
  { stepId: 'step_asthma_001', riskLevel: 'high', riskType: 'cumulative_effect', consequenceDescription: 'Skipping preventer inhaler allows airway inflammation to build up, making asthma attacks more frequent and severe.', mitigationGuidance: 'Keep inhaler next to toothbrush. Take it as part of morning and evening routines every day.', disclaimer: 'Educational only. Consult your healthcare provider before changing medication.', impactFactors: { adherenceImportance: 10, consequenceSeverity: 8, reversibility: 'reversible' } },
  { stepId: 'step_asthma_004', riskLevel: 'high', riskType: 'safety_concern', consequenceDescription: 'Without rescue inhaler available, an acute asthma attack cannot be treated and may become life-threatening.', mitigationGuidance: 'Keep rescue inhaler in bag, pocket, and bedside. Check it is not expired monthly.', disclaimer: 'Educational only. Know your emergency asthma action plan.', impactFactors: { adherenceImportance: 10, consequenceSeverity: 10, reversibility: 'reversible' } }
];

// ─── Run Seed ─────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱 Starting CAREPATH-AI database seed...\n');

  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    const SyntheticProfile = mongoose.models.SyntheticProfile || mongoose.model('SyntheticProfile', ProfileSchema);
    const CarePlan = mongoose.models.CarePlan || mongoose.model('CarePlan', CarePlanSchema);
    const CareStep = mongoose.models.CareStep || mongoose.model('CareStep', CareStepSchema);
    const Dependency = mongoose.models.Dependency || mongoose.model('Dependency', DependencySchema);
    const RiskMetadata = mongoose.models.RiskMetadata || mongoose.model('RiskMetadata', RiskSchema);

    // Wipe existing data
    await Promise.all([
      SyntheticProfile.deleteMany({}),
      CarePlan.deleteMany({}),
      CareStep.deleteMany({}),
      Dependency.deleteMany({}),
      RiskMetadata.deleteMany({})
    ]);
    console.log('✅ Cleared existing data');

    await CarePlan.insertMany(CARE_PLANS);
    console.log(`✅ Seeded ${CARE_PLANS.length} care plans`);

    await SyntheticProfile.insertMany(PROFILES);
    console.log(`✅ Seeded ${PROFILES.length} profiles`);

    await CareStep.insertMany(CARE_STEPS);
    console.log(`✅ Seeded ${CARE_STEPS.length} care steps`);

    await Dependency.insertMany(DEPENDENCIES);
    console.log(`✅ Seeded ${DEPENDENCIES.length} dependencies`);

    await RiskMetadata.insertMany(RISK_METADATA);
    console.log(`✅ Seeded ${RISK_METADATA.length} risk records`);

    console.log('\n🎉 Seed complete!\n');
    console.log('Profiles ready:');
    PROFILES.forEach(p => console.log(`  ✓ ${p.name} → ${p.carePlanId} (${p.complexityLevel})`));

    const stepsByPlan: Record<string, number> = {};
    CARE_STEPS.forEach(s => { stepsByPlan[s.carePlanId] = (stepsByPlan[s.carePlanId] || 0) + 1; });
    console.log('\nCare steps per plan:');
    Object.entries(stepsByPlan).forEach(([plan, count]) => console.log(`  ✓ ${plan}: ${count} steps`));
    console.log('');

  } catch (error: any) {
    console.error('\n❌ Seed failed:', error.message);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('authentication')) {
      console.error('👉 Check your MONGODB_URI in .env.local');
    }
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();