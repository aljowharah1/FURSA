import { useMemo, useCallback } from 'react';
import { Internship } from '../types';
import { useAppContext } from '../context/AppContext';

type SortField = 'matchScore' | 'deadline' | 'dateAdded' | 'title' | 'company';
type SortOrder = 'asc' | 'desc';

interface UseInternshipsOptions {
  filterType?: Internship['type'] | 'All';
  filterStatus?: Internship['status'] | 'All';
  searchQuery?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export function useInternships(options: UseInternshipsOptions = {}) {
  const {
    internships,
    addInternship,
    updateInternship,
    deleteInternship,
    loading,
  } = useAppContext();

  const {
    filterType = 'All',
    filterStatus = 'All',
    searchQuery = '',
    sortBy = 'matchScore',
    sortOrder = 'desc',
  } = options;

  const filtered = useMemo(() => {
    let result = [...internships];

    // Filter by type
    if (filterType !== 'All') {
      result = result.filter((i) => i.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'All') {
      result = result.filter((i) => i.status === filterStatus);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'matchScore':
          cmp = a.matchScore - b.matchScore;
          break;
        case 'deadline':
          cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          break;
        case 'dateAdded':
          cmp = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'company':
          cmp = a.company.localeCompare(b.company);
          break;
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [internships, filterType, filterStatus, searchQuery, sortBy, sortOrder]);

  const getById = useCallback(
    (id: string): Internship | undefined => internships.find((i) => i.id === id),
    [internships]
  );

  return {
    internships: filtered,
    allInternships: internships,
    loading,
    addInternship,
    updateInternship,
    deleteInternship,
    getById,
    total: internships.length,
    filteredCount: filtered.length,
  };
}
