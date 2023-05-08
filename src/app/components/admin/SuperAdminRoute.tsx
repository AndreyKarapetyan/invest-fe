import { AdminMenuSliderList } from './AdminMenuSliderList';
import { getAuth } from 'src/app/utils/auth';
import { LOGIN_ROUTE } from 'src/app/routeNames';
import { MenuSlider } from '../MenuSlider/MenuSlider';
import { Role } from 'src/app/types/role';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SuperAdminRoute({ children }: any) {
  const navigate = useNavigate();
  const { role } = getAuth();

  const onClick = (url: string) => navigate(url);

  useEffect(() => {
    if (!role) {
      navigate(LOGIN_ROUTE);
    } else if (role !== Role.SuperAdmin) {
      navigate('NotFound');
    }
  }, []);

  return (
      <MenuSlider menuList={<AdminMenuSliderList onClick={onClick} />}>
        {children}
      </MenuSlider>
  );
}
