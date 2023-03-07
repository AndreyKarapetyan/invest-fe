import { Route, Routes, Link } from 'react-router-dom';
import Login from './screens/Login';
import { AdminHome } from './screens/admin/AdminHome';
import { Box } from '@mui/system';
import { AdminRoute } from './components/admin/AdminRoute';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminHome/>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
