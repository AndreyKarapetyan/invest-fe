import { getAuth } from 'src/app/utils/auth';
import { LOGIN_ROUTE } from 'src/app/routeNames';
import { Role } from 'src/app/types/role';
import { STUDENTS_LIST_ROUTE } from 'src/app/routeNames';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { role } = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) {
      navigate(LOGIN_ROUTE);
    }
    if (role === Role.SuperAdmin) {
      navigate(STUDENTS_LIST_ROUTE);
    }
  }, [role]);

  return null;
}
