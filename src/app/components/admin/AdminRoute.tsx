import { MenuSlider } from '../MenuSlider';
// import * as React from 'react';
import { AdminMenuSliderList } from './AdminMenuSliderList';

export function AdminRoute(props: any) {
  return <MenuSlider menuList={<AdminMenuSliderList />}>{props.children}</MenuSlider>;
}
