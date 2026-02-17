'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface OnboardingData {
  ageRange: string;
  gender: string;
  conditions: string[];
  hasMedications: boolean | null;
  medications: Medication[];
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const AGE_RANGES = ['Under 18', '18–30', '31–45', '46–60', '60+'];

const CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes', icon: '🩸' },
  { id: 'hypertension', label: 'Hypertension', icon: '❤️' },
  { id: 'thyroid', label: 'Thyroid', icon: '🦋' },
  { id: 'asthma', label: 'Asthma', icon: '🫁' },
  { id: 'cardiac', label: 'Heart Disease', icon: '🫀' },
  { id: 'arthritis', label: 'Arthritis', icon: '🦴' },
  { id: 'anxiety', label: 'Anxiety / Depression', icon: '🧠' },
  { id: 'none', label: 'None', icon: '✅' },
  { id: 'other', label: 'Other', icon: '➕' },
];

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Weekly', 'As needed'];
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Bedtime', 'With meals'];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [screen, setScreen] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    ageRange: '',
    gender: '',
    conditions: [],
    hasMedications: null,
    medications: [],
  });
  const [authMode, setAuthMode] = useState<'choose' | 'email'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [medInput, setMedInput] = useState({ name: '', dosage: '', frequency: 'Once daily', time: 'Morning' });
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  // Check if onboarding already completed
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      setCheckingOnboarding(false);
      setScreen(0);
      return;
    }
    // User is authenticated — check if onboarding is done
    fetch('/api/user/onboarding')
      .then(r => r.json())
      .then(d => {
        if (d.onboardingCompleted) {
          router.push('/profiles');
        } else {
          setScreen(1);
          setCheckingOnboarding(false);
        }
      })
      .catch(() => {
        setScreen(1);
        setCheckingOnboarding(false);
      });
  }, [status, router]);

  if (!mounted || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-white text-sm">Loading...</div>
      </div>
    );
  }

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleEmailAuth = async () => {
    setAuthError('');
    setAuthLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      // Try signup
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email.split('@')[0], email, password }),
      });
      if (res.ok) {
        await signIn('credentials', { email, password, redirect: false });
      } else {
        const d = await res.json();
        setAuthError(d.error || 'Sign in failed. Check your credentials.');
      }
    }
    setAuthLoading(false);
  };

  const toggleCondition = (id: string) => {
    if (id === 'none') {
      setData(d => ({ ...d, conditions: d.conditions.includes('none') ? [] : ['none'] }));
      return;
    }
    setData(d => ({
      ...d,
      conditions: d.conditions.includes(id)
        ? d.conditions.filter(c => c !== id)
        : [...d.conditions.filter(c => c !== 'none'), id]
    }));
  };

  const addMed = () => {
    if (!medInput.name.trim()) return;
    setData(d => ({
      ...d,
      hasMedications: true,
      medications: [...d.medications, { ...medInput, id: Date.now().toString() }]
    }));
    setMedInput({ name: '', dosage: '', frequency: 'Once daily', time: 'Morning' });
  };

  const removeMed = (id: string) => {
    setData(d => ({ ...d, medications: d.medications.filter(m => m.id !== id) }));
  };

  const saveOnboarding = async () => {
    setSaving(true);
    try {
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) { /* silent */ }
    setSaving(false);
  };

  // ── Render screens directly (no inner components) ──────────────────────────

  // Screen 0: Auth
  if (screen === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1e] px-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <span className="text-2xl">🏥</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">CarePath AI</h1>
            <p className="text-[#94a3b8] mt-2 text-sm">Your personalized care companion</p>
          </div>

          {authMode === 'choose' ? (
            <div className="space-y-3">
              <button
                onClick={async () => {
                  setAuthLoading(true);
                  await signIn('google', { callbackUrl: '/onboarding' });
                }}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-medium text-sm transition-all"
                style={{ background: '#fff', color: '#1e293b' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => setAuthMode('email')}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-medium text-sm transition-all border"
                style={{ background: 'transparent', color: '#e2e8f0', borderColor: '#334155' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Continue with Email
              </button>

              <button
                onClick={() => router.push('/profiles')}
                className="w-full text-center text-sm py-2 transition-all"
                style={{ color: '#64748b' }}
              >
                Skip for now →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => setAuthMode('choose')}
                className="flex items-center gap-1 text-sm mb-4"
                style={{ color: '#64748b' }}
              >
                ← Back
              </button>
              {authError && (
                <div className="text-sm py-2.5 px-4 rounded-lg" style={{ background: '#450a0a', color: '#fca5a5' }}>
                  {authError}
                </div>
              )}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full py-3 px-4 rounded-xl text-sm outline-none"
                style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full py-3 px-4 rounded-xl text-sm outline-none"
                style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}
              />
              <button
                onClick={handleEmailAuth}
                disabled={authLoading || !email || !password}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}
              >
                {authLoading ? 'Please wait...' : 'Sign In / Sign Up'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Screen 1: Welcome
  if (screen === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1e] px-6 text-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 60%)' }} />
        </div>
        <div className="relative z-10 max-w-sm">
          <div className="text-6xl mb-6">👋</div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Welcome, {session?.user?.name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-[#94a3b8] mb-2 leading-relaxed">
            CarePath AI personalizes your health journey.
          </p>
          <p className="text-[#64748b] text-sm mb-10">
            Quick 30-second setup — or skip anytime.
          </p>
          <button
            onClick={() => setScreen(2)}
            className="w-full py-4 rounded-2xl font-semibold text-white mb-3 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            Let's personalize my care
          </button>
          <button
            onClick={() => router.push('/profiles')}
            className="w-full py-3 text-sm"
            style={{ color: '#64748b' }}
          >
            Skip for now, take me to the app →
          </button>
        </div>
      </div>
    );
  }

  // Screen 2: Age
  if (screen === 2) {
    return (
      <ScreenWrapper
        step={1} total={4}
        title="How old are you?"
        subtitle="Helps us tailor care plans to your age group"
        onBack={() => setScreen(1)}
        onNext={() => setScreen(3)}
        nextDisabled={!data.ageRange}
        nextLabel="Continue"
      >
        <div className="grid grid-cols-1 gap-3 w-full mt-6">
          {AGE_RANGES.map(range => (
            <button
              key={range}
              onClick={() => setData(d => ({ ...d, ageRange: range }))}
              className="flex items-center justify-between py-4 px-5 rounded-2xl text-left transition-all"
              style={{
                background: data.ageRange === range ? 'linear-gradient(135deg, #1d4ed8, #7c3aed)' : '#1e293b',
                border: `2px solid ${data.ageRange === range ? '#3b82f6' : '#334155'}`,
                color: data.ageRange === range ? '#fff' : '#94a3b8',
              }}
            >
              <span className="font-medium">{range}</span>
              {data.ageRange === range && <span className="text-white">✓</span>}
            </button>
          ))}
        </div>

        <div className="w-full mt-6">
          <p className="text-xs mb-3" style={{ color: '#64748b' }}>Gender (optional)</p>
          <div className="flex gap-2">
            {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
              <button
                key={g}
                onClick={() => setData(d => ({ ...d, gender: d.gender === g ? '' : g }))}
                className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: data.gender === g ? '#1d4ed8' : '#1e293b',
                  color: data.gender === g ? '#fff' : '#64748b',
                  border: `1px solid ${data.gender === g ? '#3b82f6' : '#334155'}`,
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </ScreenWrapper>
    );
  }

  // Screen 3: Conditions
  if (screen === 3) {
    return (
      <ScreenWrapper
        step={2} total={4}
        title="Any health conditions?"
        subtitle="Select all that apply. You can always update this later."
        onBack={() => setScreen(2)}
        onNext={() => setScreen(4)}
        nextLabel="Continue"
      >
        <div className="grid grid-cols-3 gap-2 w-full mt-6">
          {CONDITIONS.map(c => {
            const selected = data.conditions.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCondition(c.id)}
                className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all gap-2"
                style={{
                  background: selected ? 'linear-gradient(135deg, #1d4ed8, #7c3aed)' : '#1e293b',
                  border: `2px solid ${selected ? '#3b82f6' : '#334155'}`,
                }}
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-medium text-center leading-tight"
                  style={{ color: selected ? '#fff' : '#94a3b8' }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </ScreenWrapper>
    );
  }

  // Screen 4: Medications
  if (screen === 4) {
    if (data.hasMedications === null) {
      return (
        <ScreenWrapper
          step={3} total={4}
          title="Taking any medications?"
          subtitle="We'll help you set up reminders so you never miss a dose."
          onBack={() => setScreen(3)}
          nextLabel="Skip"
          onNext={() => { setData(d => ({ ...d, hasMedications: false })); setScreen(5); }}
        >
          <div className="space-y-3 w-full mt-8">
            <button
              onClick={() => setData(d => ({ ...d, hasMedications: true }))}
              className="w-full py-5 rounded-2xl font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', color: '#fff' }}
            >
              💊 Yes, I take medications
            </button>
            <button
              onClick={() => { setData(d => ({ ...d, hasMedications: false })); setScreen(5); }}
              className="w-full py-4 rounded-2xl font-medium transition-all"
              style={{ background: '#1e293b', color: '#64748b', border: '2px solid #334155' }}
            >
              No, skip this step →
            </button>
          </div>
        </ScreenWrapper>
      );
    }

    return (
      <ScreenWrapper
        step={3} total={4}
        title="Add your medications"
        subtitle="Add as many as you need. You can edit anytime."
        onBack={() => setData(d => ({ ...d, hasMedications: null }))}
        onNext={() => setScreen(5)}
        nextLabel={data.medications.length > 0 ? `Continue with ${data.medications.length} med${data.medications.length > 1 ? 's' : ''}` : 'Skip'}
      >
        {data.medications.length > 0 && (
          <div className="w-full space-y-2 mt-4">
            {data.medications.map(med => (
              <div key={med.id} className="flex items-center justify-between py-3 px-4 rounded-xl"
                style={{ background: '#0f172a', border: '1px solid #1e3a5f' }}>
                <div>
                  <p className="text-sm font-semibold text-white">{med.name}
                    {med.dosage && <span className="text-[#94a3b8] font-normal"> · {med.dosage}</span>}
                  </p>
                  <p className="text-xs" style={{ color: '#64748b' }}>{med.frequency} · {med.time}</p>
                </div>
                <button
                  onClick={() => removeMed(med.id)}
                  className="text-lg leading-none" style={{ color: '#64748b' }}>×</button>
              </div>
            ))}
          </div>
        )}

        <div className="w-full mt-4 space-y-2">
          <input
            placeholder="Medication name (e.g. Metformin)"
            value={medInput.name}
            onChange={e => setMedInput(m => ({ ...m, name: e.target.value }))}
            className="w-full py-3 px-4 rounded-xl text-sm outline-none"
            style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}
          />
          <div className="flex gap-2">
            <input
              placeholder="Dosage (e.g. 500mg)"
              value={medInput.dosage}
              onChange={e => setMedInput(m => ({ ...m, dosage: e.target.value }))}
              className="flex-1 py-3 px-4 rounded-xl text-sm outline-none"
              style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={medInput.frequency}
              onChange={e => setMedInput(m => ({ ...m, frequency: e.target.value }))}
              className="flex-1 py-3 px-3 rounded-xl text-sm outline-none"
              style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}
            >
              {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
            </select>
            <select
              value={medInput.time}
              onChange={e => setMedInput(m => ({ ...m, time: e.target.value }))}
              className="flex-1 py-3 px-3 rounded-xl text-sm outline-none"
              style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}
            >
              {TIMES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={addMed}
            disabled={!medInput.name.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: '#1d4ed8', color: '#fff' }}
          >
            + Add Medication
          </button>
        </div>
      </ScreenWrapper>
    );
  }

  // Screen 5: Magic/Success
  if (screen === 5) {
    const hasMeds = data.medications.length > 0;
    const firstMed = data.medications[0];

    return (
      <SaveAndShow onSave={saveOnboarding}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1e] px-6 text-center">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #059669 0%, transparent 60%)' }} />
          </div>
          <div className="relative z-10 max-w-sm">
            <div className="text-7xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-3">You're all set!</h2>

            {hasMeds ? (
              <>
                <p className="mb-6 leading-relaxed" style={{ color: '#94a3b8' }}>
                  Your first reminder has been created for <strong className="text-white">{firstMed.name}</strong>{' '}
                  every {firstMed.frequency.toLowerCase()} in the <strong className="text-white">{firstMed.time.toLowerCase()}</strong>.
                </p>
                <div className="rounded-2xl p-5 mb-8 text-left"
                  style={{ background: '#0f2a1f', border: '1px solid #065f46' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <p className="text-white font-semibold text-sm">Reminder set!</p>
                      <p className="text-xs" style={{ color: '#6ee7b7' }}>{firstMed.time} reminder</p>
                    </div>
                  </div>
                  <p className="text-white font-bold">{firstMed.name}
                    {firstMed.dosage && <span className="text-[#6ee7b7] font-normal"> · {firstMed.dosage}</span>}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#64748b' }}>{firstMed.frequency}</p>
                </div>
              </>
            ) : (
              <p className="mb-8 leading-relaxed" style={{ color: '#94a3b8' }}>
                Your profile is personalized.{data.conditions.length > 0 &&
                  ` We'll show content relevant to ${data.conditions.slice(0, 2).join(', ')}.`}
              </p>
            )}

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {data.ageRange && (
                <span className="py-1.5 px-3 rounded-full text-xs" style={{ background: '#1e293b', color: '#94a3b8' }}>
                  📅 {data.ageRange}
                </span>
              )}
              {data.conditions.filter(c => c !== 'none').slice(0, 3).map(c => {
                const cond = CONDITIONS.find(x => x.id === c);
                return (
                  <span key={c} className="py-1.5 px-3 rounded-full text-xs" style={{ background: '#1e293b', color: '#94a3b8' }}>
                    {cond?.icon} {cond?.label}
                  </span>
                );
              })}
              {data.medications.length > 0 && (
                <span className="py-1.5 px-3 rounded-full text-xs" style={{ background: '#1e293b', color: '#94a3b8' }}>
                  💊 {data.medications.length} medication{data.medications.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <button
              onClick={() => router.push('/profiles')}
              disabled={saving}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              {saving ? 'Saving...' : 'Explore Care Journeys →'}
            </button>
          </div>
        </div>
      </SaveAndShow>
    );
  }

  return null;
}

// ─── Save trigger component (calls save on mount) ─────────────────────────────
function SaveAndShow({ onSave, children }: {
  onSave: () => void;
  children: React.ReactNode;
}) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!saved) {
      setSaved(true);
      onSave();
    }
  }, [saved, onSave]);
  return <>{children}</>;
}

// ─── Reusable Screen Wrapper ──────────────────────────────────────────────────
function ScreenWrapper({
  step, total, title, subtitle, children,
  onBack, onNext, nextDisabled = false, nextLabel = 'Continue'
}: {
  step: number;
  total: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0a0f1e] px-6 pt-12 pb-8">
      <div className="w-full max-w-sm mb-8">
        <div className="flex items-center justify-between mb-2">
          {onBack && (
            <button onClick={onBack} className="text-sm" style={{ color: '#64748b' }}>
              ← Back
            </button>
          )}
          <span className="text-xs ml-auto" style={{ color: '#64748b' }}>Step {step} of {total}</span>
        </div>
        <div className="h-1 rounded-full w-full" style={{ background: '#1e293b' }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${(step / total) * 100}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
          />
        </div>
      </div>

      <div className="w-full max-w-sm flex-1">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-sm" style={{ color: '#64748b' }}>{subtitle}</p>
        {children}
      </div>

      {onNext && (
        <div className="w-full max-w-sm mt-6">
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="w-full py-4 rounded-2xl font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
