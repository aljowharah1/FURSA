import { useMemo, useCallback } from 'react';
import { Application } from '../types';
import { useAppContext } from '../context/AppContext';

type StatusFilter = Application['status'] | 'All';
type SortField = 'deadlineDate' | 'appliedDate' | 'createdDate' | 'confidenceScore' | 'lastUpdated';
type SortOrder = 'asc' | 'desc';

interface UseApplicationsOptions {
  filterStatus?: StatusFilter;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export function useApplications(options: UseApplicationsOptions = {}) {
  const {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    loading,
  } = useAppContext();

  const {
    filterStatus = 'All',
    sortBy = 'lastUpdated',
    sortOrder = 'desc',
  } = options;

  const filtered = useMemo(() => {
    let result = [...applications];

    if (filterStatus !== 'All') {
      result = result.filter((a) => a.status === filterStatus);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'deadlineDate':
          cmp = new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
          break;
        case 'appliedDate':
          cmp =
            new Date(a.appliedDate || 0).getTime() -
            new Date(b.appliedDate || 0).getTime();
          break;
        case 'createdDate':
          cmp = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
          break;
        case 'confidenceScore':
          cmp = a.confidenceScore - b.confidenceScore;
          break;
        case 'lastUpdated':
          cmp = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [applications, filterStatus, sortBy, sortOrder]);

  const getById = useCallback(
    (id: string): Application | undefined => applications.find((a) => a.id === id),
    [applications]
  );

  const getByInternshipId = useCallback(
    (internshipId: string): Application | undefined =>
      applications.find((a) => a.internshipId === internshipId),
    [applications]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

  return {
    applications: filtered,
    allApplications: applications,
    loading,
    addApplication,
    updateApplication,
    deleteApplication,
    getById,
    getByInternshipId,
    statusCounts,
    total: applications.length,
    filteredCount: filtered.length,
  };
}
