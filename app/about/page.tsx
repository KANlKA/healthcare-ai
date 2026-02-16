// app/about/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Sparkles, Heart, Brain, Lock, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          About CAREPATH-AI
        </h1>
        <p className="text-xl text-gray-600">
          Making healthcare journeys more understandable through AI-powered education
        </p>
      </section>

      {/* Mission */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          CAREPATH-AI is an educational tool designed to help patients and caregivers 
          better understand complex care journeys. Using AI technology, we provide 
          clear explanations, visualize dependencies, and break down medical information 
          into plain language—all while maintaining the highest safety standards.
        </p>
      </section>

      {/* Key Principles */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Our Principles</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                Safety First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Multiple layers of guardrails ensure all content is educational, 
                never diagnostic or prescriptive. We prioritize user safety above all else.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                Explainable AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Every AI-generated explanation shows its source and purpose. 
                We believe in transparency and helping users understand how AI assists them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                Privacy Protected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All scenarios use synthetic data. No real patient information is used, 
                stored, or processed at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                User-Centered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Content adapts to different literacy levels, ensuring accessibility 
                for all users regardless of medical knowledge.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="bg-red-50 border-2 border-red-200 rounded-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold text-red-900">What We Don't Do</h2>
        <ul className="space-y-2 text-red-800">
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">✗</span>
            <span>Diagnose medical conditions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">✗</span>
            <span>Prescribe treatments or medications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">✗</span>
            <span>Interpret medical symptoms</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">✗</span>
            <span>Replace professional medical advice</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">✗</span>
            <span>Store or process real patient data</span>
          </li>
        </ul>
      </section>

      {/* Technology */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Technology</h2>
        <p className="text-gray-700">
          CAREPATH-AI is built with modern, open-source technologies:
        </p>
        <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-blue-500">→</span>
            Next.js 14 (React Framework)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">→</span>
            Groq API (AI Integration)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">→</span>
            MongoDB (Database)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">→</span>
            TypeScript (Type Safety)
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-2xl font-bold">Learn More</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild>
            <Link href="/about/how-it-works">
              How It Works <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about/safety">
              Safety Information
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}