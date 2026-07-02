import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrap, unwrapPaginated } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { Report, ReportRequest, ReportFilters } from '@/types/api';

/** Fetch reports (moderator/admin only) */
export function useReports(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: queryKeys.reports.all(filters),
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters.status) params.status = filters.status;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;

      const res = await apiClient.get('/api/v1/reports', { params });
      return unwrapPaginated<Report[]>(res);
    },
  });
}

/** Create report */
export function useCreateReport() {
  return useMutation({
    mutationFn: async (data: ReportRequest) => {
      const res = await apiClient.post('/api/v1/reports', data);
      return res.data;
    },
  });
}

/** Update report status (moderator/admin only) */
export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: 'reviewed' | 'dismissed' }) => {
      const res = await apiClient.patch(`/api/v1/reports/${reportId}/status`, { status });
      return unwrap<Report>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
