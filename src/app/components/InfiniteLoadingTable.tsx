import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { memo } from 'react';
import { useInfiniteLoading } from '../hooks/useInfiniteLoading';

export const InfiniteLoadingTable = memo(function InfiniteLoadingTable({
  columns,
  rows,
  onEdit,
  onDelete,
  loadMore,
  isLoading,
  hasMore,
}: any) {
  const tableRef = useInfiniteLoading({ hasMore, isLoading, loadMore });
  
  return (
    <TableContainer
      sx={{ maxWidth: 'inherit', maxHeight: '70vh', margin: 'auto' }}
      ref={tableRef}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column: any) => (
              <TableCell key={column.label}>{column.label}</TableCell>
            ))}
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow key={row.id} hover>
              {columns.map((column: any) => (
                <TableCell key={`${row.id} ${column.label}`}>{row[column.name]}</TableCell>
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
})
