import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export function InfiniteLoadingTable({
  columns,
  rows,
  loadMore,
  isLoading,
  hasMore,
}: any) {
  const tableEl = useRef<any>();
  const [distanceBottom, setDistanceBottom] = useState(0);

  const debounce = (func: any) => {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, 50);
    };
  };

  const scrollListener = useCallback(
    debounce(() => {
      const bottom =
        tableEl.current.scrollHeight - tableEl.current.clientHeight;
      if (!distanceBottom) {
        setDistanceBottom(Math.round(bottom * 0.2));
      }
      if (
        tableEl.current.scrollTop > bottom - distanceBottom &&
        hasMore &&
        !isLoading
      ) {
        loadMore();
      }
    }),
    [hasMore, loadMore, isLoading, distanceBottom]
  );

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef.addEventListener('scroll', scrollListener);
    return () => {
      tableRef.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  return (
    <TableContainer
      sx={{ maxWidth: 'inherit', maxHeight: 'inherit', margin: 'auto' }}
      ref={tableEl}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column: any) => (
              <TableCell>{column.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow key={row.id}>
              {columns.map((column: any) => (
                <TableCell>{row[column.name]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
