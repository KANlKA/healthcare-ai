'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface TimelineFiltersProps {
  onFilterChange: (filters: string[]) => void;
}

export function TimelineFilters({ onFilterChange }: TimelineFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categories = ['medication', 'exercise', 'monitoring', 'appointment', 'lifestyle'];

  const toggleFilter = (category: string) => {
    const newFilters = activeFilters.includes(category)
      ? activeFilters.filter(f => f !== category)
      : [...activeFilters, category];
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={activeFilters.includes(category) ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => toggleFilter(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}