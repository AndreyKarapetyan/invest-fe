import Login from './screens/Login';
import { AdminRoute } from './components/admin/AdminRoute';
import { AdminStudents } from './screens/admin/AdminStudents';
import { AdminTeachers } from './screens/admin/AdminTeachers';
import { Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/students"
        element={
          <AdminRoute>
            <AdminStudents />
          </AdminRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <AdminRoute>
            <AdminTeachers />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
