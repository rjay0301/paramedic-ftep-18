
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuditLogs } from '@/hooks/admin/useAuditLogs';
import { RefreshCw, Filter, X, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AuditLogsViewer: React.FC = () => {
  const {
    logs,
    loading,
    page,
    limit,
    totalPages,
    setPage,
    setLimit,
    filters,
    setFilters,
    applyFilters,
    resetFilters,
    availableActions,
    availableTables,
    refreshLogs
  } = useAuditLogs();
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logDetailsOpen, setLogDetailsOpen] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      return dateString;
    }
  };

  const viewLogDetails = (log: any) => {
    setSelectedLog(log);
    setLogDetailsOpen(true);
  };

  // Format JSON data for display
  const formatJsonDisplay = (data: any) => {
    if (!data) return 'No data';
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Invalid JSON data';
    }
  };

  // Generate a simple diff view for changes
  const generateDiffView = (oldData: any, newData: any) => {
    if (!oldData || !newData) return null;
    
    const allKeys = new Set([
      ...Object.keys(oldData),
      ...Object.keys(newData)
    ]);
    
    return Array.from(allKeys).sort().map(key => {
      const oldValue = oldData[key];
      const newValue = newData[key];
      
      // Skip if values are the same
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        return null;
      }
      
      return (
        <div key={key} className="mb-2 p-2 bg-gray-50 rounded">
          <div className="font-medium">{key}</div>
          {oldValue !== undefined && (
            <div className="text-red-600 text-sm bg-red-50 p-1 rounded mt-1">
              - {typeof oldValue === 'object' ? JSON.stringify(oldValue) : oldValue}
            </div>
          )}
          {newValue !== undefined && (
            <div className="text-green-600 text-sm bg-green-50 p-1 rounded mt-1">
              + {typeof newValue === 'object' ? JSON.stringify(newValue) : newValue}
            </div>
          )}
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Audit Logs</CardTitle>
          <div className="flex space-x-2">
            <Button
              onClick={() => setFilterOpen(!filterOpen)}
              variant="outline"
              className="flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
            <Button 
              onClick={() => refreshLogs()} 
              variant="outline" 
              disabled={loading}
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filterOpen && (
            <div className="mb-4 p-4 border rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filter Audit Logs</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Action</label>
                  <Select
                    value={filters.action || ''}
                    onValueChange={(value) => setFilters({...filters, action: value || null})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Actions</SelectItem>
                      {availableActions.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Table</label>
                  <Select
                    value={filters.table || ''}
                    onValueChange={(value) => setFilters({...filters, table: value || null})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Tables</SelectItem>
                      {availableTables.map(table => (
                        <SelectItem key={table} value={table}>{table}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">From Date</label>
                  <Input
                    type="date"
                    value={filters.fromDate || ''}
                    onChange={(e) => setFilters({...filters, fromDate: e.target.value || null})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">To Date</label>
                  <Input
                    type="date"
                    value={filters.toDate || ''}
                    onChange={(e) => setFilters({...filters, toDate: e.target.value || null})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
                <Button onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading audit logs...</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead className="w-[80px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2 text-gray-400" />
                            {formatDate(log.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.user_name || (log.user_id === '00000000-0000-0000-0000-000000000000' ? 'System' : 'Unknown')}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            log.action === 'INSERT' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' :
                            log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' :
                            log.action === 'DELETE' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20' :
                            'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
                          }`}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell>{log.table_name}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewLogDetails(log)}
                          >
                            <Eye size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, logs.length + ((page - 1) * limit))} of many records
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => setLimit(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Log Details Dialog */}
      <Dialog open={logDetailsOpen} onOpenChange={setLogDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Record ID: {selectedLog?.record_id} | Action: {selectedLog?.action} | Table: {selectedLog?.table_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium mb-1">Date & Time</h3>
                  <p className="text-sm">{formatDate(selectedLog.created_at)}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">User</h3>
                  <p className="text-sm">{selectedLog.user_name || (selectedLog.user_id === '00000000-0000-0000-0000-000000000000' ? 'System' : 'Unknown')}</p>
                </div>
              </div>
              
              {selectedLog.action === 'UPDATE' && selectedLog.old_data && selectedLog.new_data && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Changes</h3>
                  <div className="border rounded-md p-4 bg-gray-50 max-h-80 overflow-y-auto">
                    {generateDiffView(selectedLog.old_data, selectedLog.new_data)}
                  </div>
                </div>
              )}
              
              {selectedLog.old_data && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Previous Data</h3>
                  <pre className="border rounded-md p-4 overflow-x-auto bg-gray-50 text-xs">
                    {formatJsonDisplay(selectedLog.old_data)}
                  </pre>
                </div>
              )}
              
              {selectedLog.new_data && (
                <div>
                  <h3 className="font-medium mb-2">New Data</h3>
                  <pre className="border rounded-md p-4 overflow-x-auto bg-gray-50 text-xs">
                    {formatJsonDisplay(selectedLog.new_data)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogsViewer;
