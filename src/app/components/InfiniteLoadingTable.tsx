import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  debounce,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export function InfiniteLoadingTable({
  columns,
  rows,
  onEdit,
  onDelete,
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
  console.log(rows);
  return (
    <TableContainer
      sx={{ maxWidth: 'inherit', maxHeight: '70vh', margin: 'auto' }}
      ref={tableEl}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column: any) => (
              <TableCell>{column.label}</TableCell>
            ))}
            <TableCell/>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow key={row.id} hover>
              {columns.map((column: any) => (
                <TableCell>{row[column.name]}</TableCell>
              ))}
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => onEdit(row)} size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(row.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
