import Login from './screens/Login';
import { AdminCalendar } from './screens/admin/AdminCalendar';
import { AdminStudents } from './screens/admin/AdminStudents';
import { AdminTeacher } from './screens/admin/AdminTeacher';
import { AdminTeachers } from './screens/admin/AdminTeachers';
import { Route, Routes } from 'react-router-dom';
import { WithBranches } from './components/admin/WithBranches';
import { WithSlider } from './components/admin/WithSlider';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/students"
        element={
          <WithSlider>
            <WithBranches>
              <AdminStudents />
            </WithBranches>
          </WithSlider>
        }
      />
      <Route
        path="/teachers"
        element={
          <WithSlider>
            <WithBranches>
              <AdminTeachers />
            </WithBranches>
          </WithSlider>
        }
      />
      <Route
        path="/teachers/:branchName/:teacherId"
        element={
          <WithSlider>
            <AdminTeacher />
          </WithSlider>
        }
      />
      <Route
        path="/calendar"
        element={
          <WithSlider>
            <WithBranches>
              <AdminCalendar />
            </WithBranches>
          </WithSlider>
        }
      />
    </Routes>
  );
}

export default App;
