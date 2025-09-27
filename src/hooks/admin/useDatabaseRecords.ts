
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const sb = supabase as any;

interface Table {
  id: string;
  name: string;
  schema: string;
  record_count: number;
  comment?: string;
  isSystem: boolean;
}

interface TableColumn {
  name: string;
  type: string;
  is_nullable: boolean;
  is_primary_key: boolean;
}

interface TableRecord {
  id: string;
  [key: string]: any;
}

export const useDatabaseRecords = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tablesLoading, setTablesLoading] = useState<boolean>(true);
  const [columnsLoading, setColumnsLoading] = useState<boolean>(false);
  const [recordsLoading, setRecordsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [records, setRecords] = useState<TableRecord[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // System tables to exclude
  const systemTablePrefixes = [
    'pg_', 
    'information_schema', 
    'extensions', 
    'auth.', 
    'storage.',
    'supabase_',
    'realtime.'
  ];

  // Fetch tables from database
  const fetchTables = useCallback(async () => {
    try {
      setTablesLoading(true);
      setError(null);
      
      const { data, error } = await sb.rpc('get_all_tables');
      
      if (error) throw error;
      
      // Filter out system tables and add isSystem flag
      const filteredTables = data.map((table: any) => {
        const isSystem = systemTablePrefixes.some(prefix => 
          table.schema.startsWith(prefix) || 
          table.name.startsWith(prefix) ||
          table.schema !== 'public'
        );
        
        return {
          ...table,
          id: `${table.schema}.${table.name}`,
          isSystem
        };
      }).filter((table: any) => table.schema === 'public');
      
      setTables(filteredTables);
    } catch (err: any) {
      console.error('Error fetching tables:', err);
      setError(err.message || 'Failed to fetch database tables');
      toast.error('Failed to load database tables');
    } finally {
      setTablesLoading(false);
      setLoading(false);
    }
  }, []);

  // Fetch table columns
  const fetchTableColumns = useCallback(async (tableName: string) => {
    if (!tableName) return;
    
    try {
      setColumnsLoading(true);
      
      // Extract schema and table name
      const [schema, name] = tableName.split('.');
      
      const { data, error } = await sb.rpc('get_table_columns', { 
        p_schema_name: schema,
        p_table_name: name
      });
      
      if (error) throw error;
      
      setColumns(data || []);
    } catch (err: any) {
      console.error('Error fetching table columns:', err);
      toast.error('Failed to load table columns');
    } finally {
      setColumnsLoading(false);
    }
  }, []);

  // Fetch records from table
  const fetchTableRecords = useCallback(async (tableName: string, page = 1, limit = 25) => {
    if (!tableName) return;
    
    try {
      setRecordsLoading(true);
      
      // Split the table name into schema and table parts
      const [schema, table] = tableName.split('.');
      
      // Calculate range for pagination
      const from = (page - 1) * limit;
      const to = page * limit - 1;
      
      // Fetch records with count for pagination
      const { data, error, count } = await sb
        .from(table)
        .select('*', { count: 'exact' })
        .range(from, to);
      
      if (error) throw error;
      
      setRecords(data || []);
      if (count !== null) setTotalRecords(count);
      
    } catch (err: any) {
      console.error('Error fetching table records:', err);
      toast.error('Failed to load records');
      setRecords([]);
      setTotalRecords(0);
    } finally {
      setRecordsLoading(false);
    }
  }, []);

  // Handle table selection
  const selectTable = useCallback((tableName: string) => {
    setSelectedTable(tableName);
    setPage(1);
    fetchTableColumns(tableName);
    fetchTableRecords(tableName, 1, limit);
  }, [fetchTableColumns, fetchTableRecords, limit]);

  // Handle page change
  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
    if (selectedTable) {
      fetchTableRecords(selectedTable, newPage, limit);
    }
  }, [selectedTable, fetchTableRecords, limit]);

  // Handle limit change
  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    if (selectedTable) {
      fetchTableRecords(selectedTable, 1, newLimit);
    }
  }, [selectedTable, fetchTableRecords]);

  // Load tables when component mounts
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  return {
    loading,
    tablesLoading,
    columnsLoading,
    recordsLoading,
    error,
    tables,
    selectedTable,
    columns,
    records,
    page,
    limit,
    totalRecords,
    totalPages,
    selectTable,
    changePage,
    changeLimit,
    refreshTables: fetchTables,
    refreshRecords: () => selectedTable && fetchTableRecords(selectedTable, page, limit)
  };
};
