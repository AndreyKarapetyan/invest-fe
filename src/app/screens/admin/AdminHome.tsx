// import React, { useState } from 'react';
// import { FixedSizeList as List } from 'react-window';
// import InfiniteLoader from 'react-window-infinite-loader';
// import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// const ROW_HEIGHT = 50;

export function AdminHome() {
  // const [items, setItems] = useState([]);
  // const [hasMoreItems, setHasMoreItems] = useState(true);
  // const loadMoreItems = (startIndex, stopIndex) => {
  //   // Your API call to get more data
  //   // Add the new items to the `items` array
  //   // If there is no more data, set `hasMoreItems` to false
  // };

  // const isItemLoaded = (index) => {
  //   return index < items.length;
  // };

  // const itemCount = hasMoreItems ? items.length + 1 : items.length;

  // return (
  //   <InfiniteLoader
  //     isItemLoaded={isItemLoaded}
  //     itemCount={itemCount}
  //     loadMoreItems={loadMoreItems}
  //   >
  //     {({ onItemsRendered, ref }: any) => (
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>Header 1</TableCell>
  //             <TableCell>Header 2</TableCell>
  //             <TableCell>Header 3</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody component={List} ref={ref} onItemsRendered={onItemsRendered}>
  //           {(({ index, style }: any) => {
  //             const item = items[index];
  //             return (
  //               <TableRow key={item.id} style={style}>
  //                 <TableCell>{item.data1}</TableCell>
  //                 <TableCell>{item.data2}</TableCell>
  //                 <TableCell>{item.data3}</TableCell>
  //               </TableRow>
  //             );
  //           })()}
  //         </TableBody>
  //       </Table>
  //     )}
  //   </InfiniteLoader>
  // );
}
