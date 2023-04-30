import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StudentsIcon from 'src/assets/student.png';
import TeachersIcon from 'src/assets/teacher.png';
import CalendarIcon from 'src/assets/calendar.png';

const AdminMenuSliderOptions = [
  {
    icon: TeachersIcon,
    text: 'Teachers',
    width: '30px',
    height: '30px',
    url: '/teachers',
  },
  {
    icon: StudentsIcon,
    text: 'Students',
    width: '36px',
    height: '36px',
    url: '/students',
  },
  {
    icon: CalendarIcon,
    text: 'Calendar',
    width: '30px',
    height: '30px',
    url: '/calendar',
  },
];

export function AdminMenuSliderList({ onClick }: any) {
  return (
    <List>
      {AdminMenuSliderOptions.map(({ icon, text, width, height, url }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={() => onClick(url)}>
            <ListItemIcon>
              <img src={icon} alt={`${text} Icon`} style={{ width, height }} />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
