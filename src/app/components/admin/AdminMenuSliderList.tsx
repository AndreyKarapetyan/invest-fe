import CalendarIcon from 'src/assets/calendar.png';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StudentsIcon from 'src/assets/student.png';
import TeachersIcon from 'src/assets/teacher.png';
import PaymentIcon from 'src/assets/payment.png';
import { CALENDAR_ROUTE, PAYMENTS_ROUTE, STUDENTS_LIST_ROUTE, TEACHERS_LIST_ROUTE } from 'src/app/routeNames';

const AdminMenuSliderOptions = [
  {
    icon: TeachersIcon,
    text: 'Teachers',
    width: '30px',
    height: '30px',
    url: TEACHERS_LIST_ROUTE,
  },
  {
    icon: StudentsIcon,
    text: 'Students',
    width: '30px',
    height: '30px',
    url: STUDENTS_LIST_ROUTE,
  },
  {
    icon: CalendarIcon,
    text: 'Calendar',
    width: '30px',
    height: '30px',
    url: CALENDAR_ROUTE,
  },
  {
    icon: PaymentIcon,
    text: 'Payments',
    width: '30px',
    height: '30px',
    url: PAYMENTS_ROUTE,
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
