import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TeachersIcon from 'src/assets/teacher.png';
import StudentsIcon from 'src/assets/student.png';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminMenuSliderOptions = [
  {
    icon: TeachersIcon,
    text: 'Teachers',
    width: '30px',
    height: '30px',
    url: '/teachers'
  },
  {
    icon: StudentsIcon,
    text: 'Students',
    width: '36px',
    height: '36px',
    url: '/students'
  },
];

export function AdminMenuSliderList() {
  const navigate = useNavigate();
  return (
    <List>
      {AdminMenuSliderOptions.map(({ icon, text, width, height, url }) => (
        <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(url)}>
              <ListItemIcon>
                <img
                  src={icon}
                  alt={`${text} Icon`}
                  style={{ width, height }}
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
