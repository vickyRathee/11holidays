'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { COUNTRIES_WITH_SLUG } from '../lib/countries-data';
import { useState } from 'react';

interface HolidaysFiltersProps {
  countryCode: string;
  /** When false, the search input is hidden (e.g. on the generic /holidays page). */
  showSearch?: boolean;
  search: string;
}

export function HolidaysFilters({
  countryCode,
  showSearch = true,
  search = '',
}: HolidaysFiltersProps) {
  const router = useRouter();
  const [value, setValue] = useState(search);

  const handleCountryChange = (slug: string) => {
    router.push(`/holidays/${slug.toLowerCase()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = value.trim();

    router.push(
      query
        ? `/holidays/${countryCode}?search=${encodeURIComponent(query)}`
        : `/holidays/${countryCode}`,
    );
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-full sm:w-[240px]">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES_WITH_SLUG.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showSearch && (
        <form onSubmit={handleSearch} className="relative w-full sm:w-[280px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search holidays..."
            className="pl-9"
          />
        </form>
      )}
    </div>
  );
}
