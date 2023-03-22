import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import {
  debounce,
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
  onRowClick,
  loadMore,
  isLoading,
  hasMore,
}: any) {
  const tableEl = useRef<any>();
  const [distanceBottom, setDistanceBottom] = useState(0);

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
    }, 50),
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
      sx={{ maxWidth: 'inherit', maxHeight: '70vh', margin: 'auto'}}
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
            <TableRow key={row.id} hover onClick={() => onRowClick(row)}>
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
