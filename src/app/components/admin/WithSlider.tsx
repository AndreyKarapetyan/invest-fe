import { AdminMenuSliderList } from './AdminMenuSliderList';
import { LoadingIndicator } from '../LoadingIndicator';
import { MenuSlider } from '../MenuSlider';
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useRef, useState, createContext } from 'react';

export function WithSlider(props: any) {
  return (
    <MenuSlider menuList={<AdminMenuSliderList />}>
      {props.children}
    </MenuSlider>
  );
}
