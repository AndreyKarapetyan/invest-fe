import moment from 'moment';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import { Calendar } from 'src/app/components/Calendar/Calendar';
import { EventDialog } from 'src/app/components/Calendar/EventDialog';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useGetEvents } from './hooks/events';
import { useGetTeacherGroups, useGetTeachers } from './hooks/teacher';

export function AdminCalendar() {
  const currentBranch = useContext(BranchContext) as any;
  const [date, setDate] = useState(moment());
  const [shouldUpdateSubmissionData, setShouldUpdateSubmissionData] = useState({
    startedUpdates: false,
    date: false,
    ids: false,
    slots: false,
  });
  const [event, setEvent] = useState<any>({});
  const { events, eventsLoading, eventsError, getEvents } = useGetEvents();
  const { teachers, teachersLoading, getTeachers } = useGetTeachers();
  const { groups, groupsLoading, getTeacherGroups } = useGetTeacherGroups();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleDialogOpen = useCallback(
    (eventData?: any) => {
      // if (eventData) {
      //   setStudent(studentData);
      //   if (studentData.teacherId) {
      //     getTeacherGroups(studentData.teacherId);
      //   }
      // }
      setDialogOpen(true);
    },
    [currentBranch, /* getTeacherGroups, */ getTeachers]
  );

  const handleDateChange = useCallback((newDate: any) => {
    setDate(newDate);
  }, []);

  const handleSubmitStart = () => {
    setShouldUpdateSubmissionData({
      startedUpdates: true,
      date: true,
      ids: true,
      slots: true,
    });
  };

  const updateSubmissionData = useCallback((inputData: any) => {
    setEvent((curData: any) => ({ ...curData, ...inputData }));
  }, []);

  const checkSubmissionStatus = useCallback(
    (key: keyof typeof shouldUpdateSubmissionData, status: boolean) => {
      setShouldUpdateSubmissionData((checks) => ({ ...checks, [key]: status }));
    },
    []
  );

  useEffect(() => {
    if (shouldUpdateSubmissionData.date) {
      updateSubmissionData({ date: date.format() });
      checkSubmissionStatus('date', false);
    }
  }, [shouldUpdateSubmissionData]);

  useEffect(() => {
    if (dialogOpen) {
      getTeachers(currentBranch.name);
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (currentBranch) {
      getEvents(currentBranch.name, date.format());
    }
  }, [currentBranch, date]);

  useEffect(() => {
    if (
      shouldUpdateSubmissionData.startedUpdates &&
      !shouldUpdateSubmissionData.date &&
      !shouldUpdateSubmissionData.ids &&
      !shouldUpdateSubmissionData.slots
    ) {
      console.log('Submitting event ', event);
      checkSubmissionStatus('startedUpdates', false);
    }
  }, [shouldUpdateSubmissionData]);

  return (
    currentBranch && (
      <Fragment>
        <Calendar
          rooms={currentBranch.room}
          events={events}
          date={date}
          handleDateChange={handleDateChange}
          getTeacherGroups={getTeacherGroups}
          handleDialogOpen={handleDialogOpen}
          shouldUpdateSubmissionData={shouldUpdateSubmissionData}
          updateSubmissionData={updateSubmissionData}
          checkSubmissionStatus={checkSubmissionStatus}
        />
        {dialogOpen && (
          <EventDialog
            // handleSubmit={() => {}}
            isOpen={dialogOpen}
            handleClose={handleDialogClose}
            getTeacherGroups={getTeacherGroups}
            teachers={teachers}
            groups={groups}
            teachersLoading={teachersLoading}
            shouldUpdateSubmissionData={shouldUpdateSubmissionData}
            updateSubmissionData={updateSubmissionData}
            handleSubmitStart={handleSubmitStart}
            checkSubmissionStatus={checkSubmissionStatus}
          />
        )}
      </Fragment>
    )
  );
}
