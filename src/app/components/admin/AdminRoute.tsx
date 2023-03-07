import { MenuSlider } from '../MenuSlider';
// import * as React from 'react';
import { Llist } from './AdminMenuSliderList';

export function AdminRoute(props: any) {
  return <MenuSlider menuList={<Llist />}>{props.children}</MenuSlider>;
}
