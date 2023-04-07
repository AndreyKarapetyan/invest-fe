import Login from './screens/Login';
import { WithBranches } from './components/admin/WithBranches';
import { AdminStudents } from './screens/admin/AdminStudents';
import { AdminTeachers } from './screens/admin/AdminTeachers';
import { Route, Routes } from 'react-router-dom';
import { AdminTeacher } from './screens/admin/AdminTeacher';
import { WithSlider } from './components/admin/WithSlider';
import { Calendar } from './screens/Calendar';

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
            <Calendar />
          </WithSlider>
        }
      />
    </Routes>
  );
}

export default App;
