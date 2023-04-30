import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Button, Grid } from '@mui/material';
import { DnD } from 'src/app/components/admin/DnD';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { TeacherFormComponents } from 'src/app/components/admin/SimpleFormComponents/TeacherFormComponents';
import { useCallback, useEffect, useState } from 'react';
import { useGetStudents } from './hooks/student';
import {
  useCreateTeacher,
  useGetTeacher,
  useUpdateTeacher,
} from './hooks/teacher';
import { useNavigate, useParams } from 'react-router-dom';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { deepClone } from 'src/app/utils/deepClone';
import { isEmail, isPositive, isStrongPassword } from 'class-validator';
import { TeacherLevel } from 'src/app/types/teacher';

export default function AdminTeacher(props: any) {
  const { branchName, teacherId } = useParams();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState({
    branchName,
    name: '',
    lastname: '',
    email: '',
    password: '',
    level: '',
    phoneNumber: '',
    salaryPercent: '',
    groups: {
      studentList: {
        id: 'studentList',
        name: 'studentList',
        students: [],
      },
    },
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    lastname: false,
    email: false,
    password: false,
    level: false,
    phoneNumber: false,
    salaryPercent: false,
  });
  const validationFuncMapping = {
    name: (name: any) => name,
    lastname: (lastname: any) => lastname,
    email: (email: any) => isEmail(email),
    password: (password: any) => isStrongPassword(password),
    level: (level: any) => Object.values(TeacherLevel).includes(level),
    phoneNumber: (phoneNumber: any) => phoneNumber,
    salaryPercent: (salaryPercent: any) => salaryPercent && isPositive(Number(salaryPercent))
  };
  const { teacherLoading, teacherError, teacher, getTeacher } = useGetTeacher();
  const { students, studentsLoading, hasMore, getStudents } = useGetStudents();
  const [shouldUpdateGroupsFromDnD, setShouldUpdateGroupsFromDnD] =
    useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const {
    newTeacherId,
    resetTeacherId,
    createTeacher,
    teacherCreateError,
    teacherCreateLoading,
  } = useCreateTeacher();
  const {
    isTeacherUpdated,
    resetTeacherUpdateSuccess,
    teacherUpdateError,
    teacherUpdateLoading,
    updateTeacher,
  } = useUpdateTeacher();

  const goBackToTheList = () => {
    navigate('/teachers');
  };

  const loadMore = useCallback(() => {
    getStudents(branchName as string);
  }, [getStudents]);

  const handleTeacherDataChange = (key: string, value: any) => {
    console.log(key, value, !validationFuncMapping[key as keyof typeof validationFuncMapping](value))
    setTeacherData((curTeacher: any) => ({
      ...curTeacher,
      [key]: value,
    }));
    setFormErrors((curErrors) => ({
      ...curErrors,
      [key]: !validationFuncMapping[key as keyof typeof validationFuncMapping](value),
    }));
  };

  const onInputChange = useCallback(({ target: { name, value } }: any) => {
    handleTeacherDataChange(name, value || null);
  }, []);

  const handleGroupChange = useCallback((newGroups: any) => {
    setTeacherData((curData) => ({
      ...curData,
      groups: newGroups,
    }));
    setShouldUpdateGroupsFromDnD(false);
    setShouldSubmit(true);
  }, []);

  const handleSubmitStart = () => {
    const { name, lastname, email, level, password, phoneNumber, salaryPercent } = teacherData;
    const errors: typeof formErrors = {
      name: !validationFuncMapping.name(name),
      lastname: !validationFuncMapping.lastname(lastname),
      email: !validationFuncMapping.email(email),
      level: !validationFuncMapping.level(level),
      password: !validationFuncMapping.password(password),
      phoneNumber: !validationFuncMapping.phoneNumber(phoneNumber),
      salaryPercent: !validationFuncMapping.salaryPercent(salaryPercent),
    };
    setFormErrors(errors as any);
    const areErrors = Object.values(errors).some((err) => err);
    if (!areErrors) {
      console.log('Going to submit!!!!!!')
     setShouldUpdateGroupsFromDnD(true);
    }
  };

  const cancelSubmit = () => {
    setShouldUpdateGroupsFromDnD(false);
  }

  useEffect(() => {
    const id = Number(teacherId);
    if (!isNaN(id) && id > 0) {
      getTeacher(id);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacher) {
      setTeacherData({
        ...teacher,
        groups: {
          ...teacher.groups,
          studentList: {
            id: 'studentList',
            students: [],
          },
        },
      });
    }
  }, [teacher]);

  useEffect(() => {
    getStudents(branchName as string, true);
  }, []);

  useEffect(() => {
    if (shouldSubmit) {
      const data = deepClone(teacherData);
      const groups = Object.values(data.groups).filter(
        ({ id }) => id !== 'studentList'
      );
      if (teacherId === 'new') {
        const submissionData = {
          ...data,
          groups,
        };
        createTeacher(submissionData);
      } else {
        const id = Number(teacherId);
        const submissionData = {
          id,
          ...data,
          groups,
        };
        updateTeacher(id, submissionData);
      }
      setShouldSubmit(false);
    }
  }, [shouldSubmit]);

  useEffect(() => {
    if (newTeacherId) {
      navigate(`../teachers/${branchName}/${newTeacherId}`, { replace: true });
      setTimeout(() => {
        resetTeacherId();
      }, 2000);
    }
  }, [newTeacherId]);

  useEffect(() => {
    if (isTeacherUpdated) {
      getTeacher(Number(teacherId));
      setTimeout(() => {
        resetTeacherUpdateSuccess();
      }, 2000);
    }
  }, [isTeacherUpdated]);

  return teacherLoading ||
    teacherCreateLoading ||
    teacherUpdateLoading ||
    !students.length ? (
    <LoadingIndicator
      open={
        teacherLoading ||
        teacherCreateLoading ||
        teacherUpdateLoading ||
        !students.length
      }
    />
  ) : (
    <Box
      sx={{
        width: '90%',
        maxHeight: '90vh',
        marginX: 'auto',
        marginTop: 3,
      }}
    >
      {(newTeacherId || isTeacherUpdated) && (
        <TopCenterSnackbar
          message="Success"
          open={Boolean(newTeacherId) || isTeacherUpdated}
        />
      )}
      <Grid container justifyContent="space-between">
        <Button
          sx={{
            marginX: '5%',
            padding: '10px',
            marginBottom: '25px',
            width: '200px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
          variant="text"
          onClick={goBackToTheList}
          startIcon={<KeyboardBackspaceIcon />}
        >
          Back To The List
        </Button>
        <Button
          sx={{
            marginX: '5%',
            padding: '10px',
            marginBottom: '25px',
            width: '200px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
          variant="text"
          onClick={handleSubmitStart}
        >
          Save Changes
        </Button>
      </Grid>
      <Grid
        container
        direction="column"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          width="80%"
          container
          direction="row"
          flexWrap="wrap"
          justifyContent="space-evenly"
        >
          <TeacherFormComponents
            formErrors={formErrors}
            teacherData={teacherData}
            onInputChange={onInputChange}
          />
        </Grid>
        <DnD
          hasMore={hasMore}
          areStudentsLoading={studentsLoading}
          loadMore={loadMore}
          students={students}
          inputGroups={teacherData.groups}
          handleGroupChange={handleGroupChange}
          shouldUpdateGroupsFromDnD={shouldUpdateGroupsFromDnD}
          cancelSubmit={cancelSubmit}
        />
      </Grid>
    </Box>
  );
}
