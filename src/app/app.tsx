import { AdminCalendar } from './screens/admin/AdminCalendar';
import { AdminPayments } from './screens/admin/AdminPayments';
import { AdminStudents } from './screens/admin/AdminStudents';
import { AdminTeacher } from './screens/admin/AdminTeacher';
import { AdminTeachers } from './screens/admin/AdminTeachers';
import {
  CALENDAR_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  PAYMENTS_ROUTE,
  STUDENTS_LIST_ROUTE,
  TEACHER_ROUTE,
  TEACHERS_LIST_ROUTE,
} from './routeNames';
import { Home } from './components/Home';
import { Login } from './screens/global/Login';
import { NotFound } from './screens/global/NotFound';
import { Route, Routes } from 'react-router-dom';
import { SuperAdminRoute } from './components/admin/SuperAdminRoute';
import { WithBranches } from './components/admin/WithBranches';

export function App() {
  return (
    <Routes>
      <Route path={HOME_ROUTE} element={<Home />} />
      <Route path={LOGIN_ROUTE} element={<Login />} />
      <Route
        path={STUDENTS_LIST_ROUTE}
        element={
          <SuperAdminRoute>
            <WithBranches>
              <AdminStudents />
            </WithBranches>
          </SuperAdminRoute>
        }
      />
      <Route
        path={TEACHERS_LIST_ROUTE}
        element={
          <SuperAdminRoute>
            <WithBranches>
              <AdminTeachers />
            </WithBranches>
          </SuperAdminRoute>
        }
      />
      <Route
        path={TEACHER_ROUTE}
        element={
          <SuperAdminRoute>
            <AdminTeacher />
          </SuperAdminRoute>
        }
      />
      <Route
        path={CALENDAR_ROUTE}
        element={
          <SuperAdminRoute>
            <WithBranches>
              <AdminCalendar />
            </WithBranches>
          </SuperAdminRoute>
        }
      />
      <Route
        path={PAYMENTS_ROUTE}
        element={
          <SuperAdminRoute>
            <WithBranches>
              <AdminPayments />
            </WithBranches>
          </SuperAdminRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
