import { AdminMenuSliderList } from './AdminMenuSliderList';
import { getAuth } from 'src/app/utils/auth';
import { LOGIN_ROUTE } from 'src/app/routeNames';
import { MenuSlider } from '../MenuSlider';
import { Role } from 'src/app/types/role';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingIndicator } from '../LoadingIndicator';

export function SuperAdminRoute({ children }: any) {
  const navigate = useNavigate();
  const { role } = getAuth();
  const loadingTimeOut = useRef<any>();
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onClick = (url: string) => startTransition(() => navigate(url));

  useEffect(() => {
    if (!role) {
      navigate(LOGIN_ROUTE);
    } else if (role !== Role.SuperAdmin) {
      navigate('NotFound');
    }
  }, []);

  useEffect(() => {
    if (isPending) {
      loadingTimeOut.current = setTimeout(() => setIsLoadingShowing(true), 100);
    } else {
      clearTimeout(loadingTimeOut.current);
      setIsLoadingShowing(false);
    }
  }, [isPending]);

  return (
    <MenuSlider menuList={<AdminMenuSliderList onClick={onClick} />}>
      {children}
      {isLoadingShowing && <LoadingIndicator open={isLoadingShowing}/>}
    </MenuSlider>);
}
