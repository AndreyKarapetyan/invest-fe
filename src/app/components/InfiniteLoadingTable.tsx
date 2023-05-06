import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { memo } from 'react';
import { useInfiniteLoading } from '../hooks/useInfiniteLoading';

export const InfiniteLoadingTable = memo(function InfiniteLoadingTable({
  columns,
  rows,
  loadMore,
  isLoading,
  hasMore,
}: any) {
  const tableRef = useInfiniteLoading({ hasMore, isLoading, loadMore });

  return (
    <TableContainer sx={{ maxWidth: 'inherit', maxHeight: '70vh', margin: 'auto' }} ref={tableRef}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column: any) => (
              <TableCell sx={{ textAlign: 'center' }} key={column.label}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow key={row.id} hover>
              {columns.map(({ label, name, Component, withValue }: any) => (
                <TableCell sx={{ textAlign: 'center' }} key={`${row.id} ${label}`}>
                  {withValue ? <Component>{row[name]}</Component> : <Component row={row} />}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
