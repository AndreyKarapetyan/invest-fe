import { TableVirtuoso } from 'react-virtuoso';
import React, { Fragment, memo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { isEqual } from 'lodash';

const TableComponents = {
  Scroller: TableContainer,
  Table: (props: any) => <Table {...props} stickyHeader />,
  TableHead,
  TableRow: (props: any) => <TableRow {...props} hover />,
  TableBody,
};

export const InfiniteLoadingTable = memo(
  function InfiniteLoadingTable({ columns, rows, loadMore }: any) {
    return (
      <TableVirtuoso
        style={{ maxHeight: '70vh', height: '70vh', margin: 'auto' }}
        data={rows}
        endReached={loadMore}
        components={TableComponents}
        fixedHeaderContent={() => (
          <TableRow>
            {columns.map(({ label, withValue }: any) => (
              <TableCell sx={{ textAlign: 'center' }} key={label}>
                {withValue ? label : null}
              </TableCell>
            ))}
          </TableRow>
        )}
        itemContent={(_index, row) => (
          <Fragment>
            {columns.map(({ label, name, Component, withValue }: any) => (
              <TableCell sx={{ textAlign: 'center' }} key={`${row.id} ${name}`}>
                {withValue ? <Component>{row[name]}</Component> : <Component row={row} />}
              </TableCell>
            ))}
          </Fragment>
        )}
      />
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.rows, nextProps.rows),
);
