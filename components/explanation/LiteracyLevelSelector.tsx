import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LiteracyLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LiteracyLevelSelector({ value, onChange }: LiteracyLevelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="basic">Basic (6-8th grade)</SelectItem>
        <SelectItem value="intermediate">Intermediate (9-10th grade)</SelectItem>
        <SelectItem value="advanced">Advanced (11-12th grade)</SelectItem>
      </SelectContent>
    </Select>
  );
}