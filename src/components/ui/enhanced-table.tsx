'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import { Input } from './input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

// 排序方向类型
export type SortDirection = 'asc' | 'desc' | null;

// 列定义类型
export interface ColumnDef<T = any> {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  cell?: (props: { row: T; value: any }) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

// 筛选器类型
export interface Filter {
  id: string;
  value: any;
}

// 分页信息类型
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  total: number;
}

// 表格状态类型
export interface TableState {
  sorting: { id: string; desc: boolean }[];
  filters: Filter[];
  pagination: PaginationState;
  globalFilter: string;
}

// 增强表格属性
export interface EnhancedTableProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  globalSearch?: boolean;
  selectable?: boolean;
  className?: string;
  onStateChange?: (state: Partial<TableState>) => void;
  onRowClick?: (row: T) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  emptyMessage?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
}

/**
 * 增强表格组件
 * 支持排序、筛选、分页、搜索等功能
 */
export function EnhancedTable<T = any>({
  data,
  columns,
  loading = false,
  pagination = true,
  sorting = true,
  filtering = false,
  globalSearch = true,
  selectable = false,
  className,
  onStateChange,
  onRowClick,
  onRowSelect,
  emptyMessage = '暂无数据',
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
}: EnhancedTableProps<T>) {
  // 状态管理
  const [tableState, setTableState] = React.useState<TableState>({
    sorting: [],
    filters: [],
    pagination: {
      pageIndex: 0,
      pageSize,
      total: data.length,
    },
    globalFilter: '',
  });

  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(
    new Set()
  );

  // 更新状态的辅助函数
  const updateState = React.useCallback(
    (updates: Partial<TableState>) => {
      setTableState((prev) => {
        const newState = { ...prev, ...updates };
        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // 处理排序
  const handleSort = React.useCallback(
    (columnId: string) => {
      if (!sorting) return;

      const existingSort = tableState.sorting.find((s) => s.id === columnId);
      let newSorting: { id: string; desc: boolean }[];

      if (!existingSort) {
        newSorting = [{ id: columnId, desc: false }];
      } else if (!existingSort.desc) {
        newSorting = [{ id: columnId, desc: true }];
      } else {
        newSorting = [];
      }

      updateState({ sorting: newSorting });
    },
    [sorting, tableState.sorting, updateState]
  );

  // 处理全局搜索
  const handleGlobalSearch = React.useCallback(
    (value: string) => {
      updateState({
        globalFilter: value,
        pagination: { ...tableState.pagination, pageIndex: 0 },
      });
    },
    [tableState.pagination, updateState]
  );

  // 处理分页
  const handlePageChange = React.useCallback(
    (pageIndex: number) => {
      updateState({
        pagination: { ...tableState.pagination, pageIndex },
      });
    },
    [tableState.pagination, updateState]
  );

  const handlePageSizeChange = React.useCallback(
    (newPageSize: number) => {
      updateState({
        pagination: {
          ...tableState.pagination,
          pageSize: newPageSize,
          pageIndex: 0,
        },
      });
    },
    [tableState.pagination, updateState]
  );

  // 数据处理
  const processedData = React.useMemo(() => {
    let result = [...data];

    // 全局搜索
    if (tableState.globalFilter) {
      const searchTerm = tableState.globalFilter.toLowerCase();
      result = result.filter((row) =>
        columns.some((column) => {
          const value = column.accessorKey ? row[column.accessorKey] : '';
          return String(value).toLowerCase().includes(searchTerm);
        })
      );
    }

    // 排序
    if (tableState.sorting.length > 0) {
      const sort = tableState.sorting[0];
      const column = columns.find((col) => col.id === sort.id);
      if (column?.accessorKey) {
        result.sort((a, b) => {
          const aValue = a[column.accessorKey!];
          const bValue = b[column.accessorKey!];

          if (aValue < bValue) return sort.desc ? 1 : -1;
          if (aValue > bValue) return sort.desc ? -1 : 1;
          return 0;
        });
      }
    }

    return result;
  }, [data, columns, tableState.globalFilter, tableState.sorting]);

  // 处理行选择
  const handleRowSelect = React.useCallback(
    (rowIndex: number, selected: boolean) => {
      if (!selectable) return;

      const newSelectedRows = new Set(selectedRows);
      if (selected) {
        newSelectedRows.add(rowIndex);
      } else {
        newSelectedRows.delete(rowIndex);
      }

      setSelectedRows(newSelectedRows);
    },
    [selectable, selectedRows]
  );

  // 分页数据
  const { filteredData, totalPages } = React.useMemo(() => {
    const total = processedData.length;
    const pages = Math.ceil(total / tableState.pagination.pageSize);

    if (!pagination) {
      return { filteredData: processedData, totalPages: 1 };
    }

    const start =
      tableState.pagination.pageIndex * tableState.pagination.pageSize;
    const end = start + tableState.pagination.pageSize;

    return {
      filteredData: processedData.slice(start, end),
      totalPages: pages,
    };
  }, [processedData, pagination, tableState.pagination]);

  // 处理选择数据变化
  React.useEffect(() => {
    if (selectedRows.size > 0) {
      const selectedData = Array.from(selectedRows)
        .map((index) => filteredData[index])
        .filter(Boolean);
      onRowSelect?.(selectedData);
    } else {
      onRowSelect?.([]);
    }
  }, [selectedRows, filteredData, onRowSelect]);

  // 获取排序图标
  const getSortIcon = (columnId: string) => {
    const sort = tableState.sorting.find((s) => s.id === columnId);
    if (!sort) return <ChevronsUpDown className="h-4 w-4" />;
    return sort.desc ? (
      <ChevronDown className="h-4 w-4" />
    ) : (
      <ChevronUp className="h-4 w-4" />
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        {/* 搜索 */}
        {globalSearch && (
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="搜索..."
              value={tableState.globalFilter}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* 筛选器 */}
        {filtering && (
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
        )}
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const allIndexes = new Set(
                          filteredData.map((_, index) => index)
                        );
                        setSelectedRows(allIndexes);
                        onRowSelect?.(filteredData);
                      } else {
                        setSelectedRows(new Set());
                        onRowSelect?.([]);
                      }
                    }}
                  />
                </TableHead>
              )}

              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    column.className,
                    column.sortable && 'cursor-pointer select-none',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && getSortIcon(column.id)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence mode="wait">
              {loading ? (
                <TableRow key="loading">
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="py-8 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2"></div>
                      加载中...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow key="empty">
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="text-muted-foreground py-8 text-center"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    className={cn(
                      'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
                      selectedRows.has(rowIndex) && 'bg-muted',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                  >
                    {selectable && (
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedRows.has(rowIndex)}
                          onChange={(e) =>
                            handleRowSelect(rowIndex, e.target.checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => {
                      const value = column.accessorKey
                        ? row[column.accessorKey]
                        : undefined;
                      const cellContent = column.cell
                        ? column.cell({ row, value })
                        : String(value || '');

                      return (
                        <TableCell
                          key={column.id}
                          className={cn(
                            column.className,
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {cellContent}
                        </TableCell>
                      );
                    })}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {pagination && !loading && filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>每页显示</span>
            <Select
              value={String(tableState.pagination.pageSize)}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>条记录</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              disabled={tableState.pagination.pageIndex === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(tableState.pagination.pageIndex - 1)
              }
              disabled={tableState.pagination.pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-muted-foreground text-sm">
              第 {tableState.pagination.pageIndex + 1} 页，共 {totalPages} 页
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(tableState.pagination.pageIndex + 1)
              }
              disabled={tableState.pagination.pageIndex >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={tableState.pagination.pageIndex >= totalPages - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
