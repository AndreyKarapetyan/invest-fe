import { Route, Routes, Link } from 'react-router-dom';
import Login from './screens/Login';
import { AdminStudents } from './screens/admin/AdminStudents';
import { Box } from '@mui/system';
import { AdminRoute } from './components/admin/AdminRoute';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/students"
        element={
          <AdminRoute>
            <AdminStudents/>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
