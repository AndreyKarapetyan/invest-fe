import { MenuSlider } from '../MenuSlider';
import { AdminMenuSliderList } from './AdminMenuSliderList';

export function AdminRoute(props: any) {
  return (
    <MenuSlider menuList={<AdminMenuSliderList />}>
      {props.children}
    </MenuSlider>
  );
}
