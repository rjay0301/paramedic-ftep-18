
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const sb = supabase as any;

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string;
  old_data: any | null;
  new_data: any | null;
  created_at: string;
  user_name?: string | null;
}

interface QueryParams {
  page: number;
  limit: number;
  action?: string;
  table?: string;
  fromDate?: string;
  toDate?: string;
}

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [filters, setFilters] = useState<{
    action: string | null;
    table: string | null;
    fromDate: string | null;
    toDate: string | null;
  }>({
    action: null,
    table: null,
    fromDate: null,
    toDate: null
  });
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [availableTables, setAvailableTables] = useState<string[]>([]);

  const fetchAuditLogs = useCallback(async ({ page, limit, action, table, fromDate, toDate }: QueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query for audit logs
      let query = sb
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      // Apply filters if provided
      if (action) query = query.eq('action', action);
      if (table) query = query.eq('table_name', table);
      if (fromDate) query = query.gte('created_at', fromDate);
      if (toDate) query = query.lte('created_at', toDate);
      
      const { data, error, count } = await query;

      if (error) throw error;
      
      // Fetch user names for all unique user IDs
      const logsData = (data as any[]) || [];
      const userIds = Array.from(new Set(logsData
        .map((log: any) => log.user_id as string | null)
        .filter((id: string | null) => id !== null && id !== '00000000-0000-0000-0000-000000000000'))) as string[];
      
      const userNames: Record<string, string> = {};
      
      if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);
          
        if (!usersError && users) {
          users.forEach(user => {
            userNames[user.id] = user.full_name;
          });
        }
      }
      
      // Add user names to logs
      const logsWithUserNames = logsData.map((log: any) => ({
        ...log,
        user_name: log.user_id && log.user_id !== '00000000-0000-0000-0000-000000000000' 
          ? userNames[log.user_id] || 'Unknown User'
          : 'System'
      }));
      
      setLogs(logsWithUserNames as AuditLog[]);
      if (count !== null) setTotalCount(count);
      
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      setError(err.message || 'Failed to fetch audit logs');
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailableFilters = useCallback(async () => {
    try {
      // Fetch available actions
      const { data: actionData, error: actionError } = await sb
        .from('audit_logs')
        .select('action')
        .limit(1000);
      
      if (actionError) throw actionError;
      
      const actions = Array.from(new Set(((actionData as any[]) || []).map((item: any) => String(item.action || '')))).filter(Boolean) as string[];
      setAvailableActions(actions);
      
      // Fetch available tables
      const { data: tableData, error: tableError } = await sb
        .from('audit_logs')
        .select('table_name')
        .limit(1000);
      
      if (tableError) throw tableError;
      
      const tables = Array.from(new Set(((tableData as any[]) || []).map((item: any) => String(item.table_name || '')))).filter(Boolean) as string[];
      setAvailableTables(tables);
      
    } catch (err: any) {
      console.error('Error fetching filter options:', err);
    }
  }, []);

  // Load audit logs and filter options when component mounts
  useEffect(() => {
    fetchAuditLogs({ page, limit });
    fetchAvailableFilters();
  }, [page, limit, fetchAuditLogs, fetchAvailableFilters]);

  // Apply filters
  const applyFilters = useCallback(() => {
    setPage(1); // Reset to first page
    fetchAuditLogs({
      page: 1,
      limit,
      action: filters.action || undefined,
      table: filters.table || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined
    });
  }, [filters, limit, fetchAuditLogs]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      action: null,
      table: null,
      fromDate: null,
      toDate: null
    });
    setPage(1);
    fetchAuditLogs({ page: 1, limit });
  }, [limit, fetchAuditLogs]);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return {
    logs,
    loading,
    error,
    page,
    limit,
    totalCount,
    totalPages,
    setPage,
    setLimit,
    filters,
    setFilters,
    applyFilters,
    resetFilters,
    availableActions,
    availableTables,
    refreshLogs: () => fetchAuditLogs({ page, limit, 
      action: filters.action || undefined,
      table: filters.table || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined
    })
  };
};
