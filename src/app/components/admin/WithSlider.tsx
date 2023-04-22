import { AdminMenuSliderList } from './AdminMenuSliderList';
import { MenuSlider } from '../MenuSlider';

export function WithSlider(props: any) {
  return (
    <MenuSlider menuList={<AdminMenuSliderList />}>{props.children}</MenuSlider>
  );
}
