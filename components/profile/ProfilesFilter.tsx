'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProfileCard } from './ProfileCard';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface Profile {
  profileId: string;
  name: string;
  age: number;
  gender: string;
  scenarioDescription: string;
  complexityLevel: string;
  tags: string[];
}

export function ProfilesFilter({ profiles }: { profiles: Profile[] }) {
  const [showFilters, setShowFilters] = useState(false);
  const [complexity, setComplexity] = useState<string | null>(null);

  const allTags = Array.from(new Set(profiles.flatMap(p => p.tags)));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = profiles.filter(p => {
    if (complexity && p.complexityLevel !== complexity) return false;
    if (selectedTags.length > 0 && !selectedTags.some(t => p.tags.includes(t))) return false;
    return true;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setComplexity(null);
    setSelectedTags([]);
  };

  const hasFilters = complexity || selectedTags.length > 0;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
          {hasFilters && (
            <span className="ml-1.5 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {(complexity ? 1 : 0) + selectedTags.length}
            </span>
          )}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4 border">
          <div>
            <p className="text-sm font-medium mb-2">Complexity</p>
            <div className="flex gap-2">
              {['low', 'moderate', 'high'].map(level => (
                <Button
                  key={level}
                  variant={complexity === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setComplexity(complexity === level ? null : level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No profiles match your filters</p>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2">
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile) => (
            <Link
              key={profile.profileId}
              href={`/profiles/${profile.profileId}`}
              className="transition-transform hover:scale-105"
            >
              <ProfileCard profile={profile} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
