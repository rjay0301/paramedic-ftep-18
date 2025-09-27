
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDatabaseRecords } from '@/hooks/admin/useDatabaseRecords';
import { RefreshCw, Database, Table as TableIcon, Search } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DatabaseRecordsManager: React.FC = () => {
  const {
    loading,
    tablesLoading,
    columnsLoading,
    recordsLoading,
    tables,
    selectedTable,
    columns,
    records,
    page,
    limit,
    totalPages,
    selectTable,
    changePage,
    changeLimit,
    refreshTables,
    refreshRecords
  } = useDatabaseRecords();
  
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  
  // Filter tables based on search term
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(tableSearchTerm.toLowerCase())
  );

  // Function to display cell value
  const displayCellValue = (value: any) => {
    if (value === null) return <span className="text-gray-400">NULL</span>;
    if (value === undefined) return <span className="text-gray-400">undefined</span>;
    
    if (typeof value === 'object') {
      try {
        return (
          <div className="max-h-24 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
          </div>
        );
      } catch (e) {
        return String(value);
      }
    }
    
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    
    return String(value);
  };

  // Get display name for a table
  const getTableDisplayName = (fullName: string) => {
    const parts = fullName.split('.');
    return parts.length > 1 ? parts[1] : fullName;
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Database Records Manager</CardTitle>
          <Button
            onClick={selectedTable ? refreshRecords : refreshTables}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-1 border-r">
              <div className="pr-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Database size={18} className="mr-2 text-gray-500" />
                  Tables
                </h3>
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search tables..."
                      className="pl-8"
                      value={tableSearchTerm}
                      onChange={(e) => setTableSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {tablesLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-gray-500">Loading tables...</p>
                  </div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto">
                    <ul className="space-y-1">
                      {filteredTables.length > 0 ? (
                        filteredTables.map((table) => (
                          <li key={table.id}>
                            <button
                              onClick={() => selectTable(table.id)}
                              className={`flex items-center text-left w-full px-3 py-2 rounded-md text-sm ${
                                selectedTable === table.id
                                  ? 'bg-red-100 text-red-800'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <TableIcon size={14} className="mr-2 text-gray-500" />
                              <span className="truncate">{getTableDisplayName(table.id)}</span>
                              <span className="ml-auto text-xs text-gray-500">{table.record_count}</span>
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="text-center py-4 text-gray-500">
                          No tables found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-4">
              {selectedTable ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">
                      {getTableDisplayName(selectedTable)} Records
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {totalPages > 0 ? `Page ${page} of ${totalPages}` : 'No records'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changePage(page > 1 ? page - 1 : 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changePage(page < totalPages ? page + 1 : totalPages)}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                      <Select
                        value={limit.toString()}
                        onValueChange={(value) => changeLimit(parseInt(value))}
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
                  
                  {columnsLoading || recordsLoading ? (
                    <div className="flex items-center justify-center h-64 border rounded-md">
                      <p className="text-gray-500">Loading records...</p>
                    </div>
                  ) : records.length > 0 ? (
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {columns.map((column) => (
                              <TableHead key={column.name} className={column.is_primary_key ? 'font-bold' : ''}>
                                <div className="flex items-center">
                                  <span>{column.name}</span>
                                  {column.is_primary_key && (
                                    <span className="ml-1 text-xs text-blue-500" title="Primary Key">🔑</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">{column.type}</div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {records.map((record, index) => (
                            <TableRow key={record.id || index}>
                              {columns.map((column) => (
                                <TableCell key={column.name} className="align-top">
                                  {displayCellValue(record[column.name])}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 border rounded-md">
                      <p className="text-gray-500">No records found</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border rounded-md">
                  <Database size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-1">No Table Selected</h3>
                  <p className="text-sm text-gray-400 text-center">
                    Select a table from the left panel to view its records
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseRecordsManager;
