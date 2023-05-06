import moment from 'moment';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import { Calendar } from 'src/app/components/Calendar/Calendar';
import { ChangeMode } from 'src/app/types/changeMode';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { useCreateEvent, useDeleteEvent, useGetEvents, useUpdateEvent } from './hooks/events';
import { useErrorBoundary } from 'react-error-boundary';
import { useGetTeacherGroups, useGetTeachers } from './hooks/teacher';

export default function AdminCalendar() {
  const currentBranch = useContext(BranchContext) as any;
  const [date, setDate] = useState(moment());
  const [shouldUpdateSubmissionData, setShouldUpdateSubmissionData] = useState({
    startedSubmitProcess: false,
    date: false,
    ids: false,
    slots: false,
    changeModeConfirmed: false,
  });
  const [event, setEvent] = useState<any>({});
  const [deletableEvent, setDeletableEvent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { events, eventsLoading, eventsError, getEvents } = useGetEvents();
  const { teachers, teachersLoading, getTeachers, teachersError } = useGetTeachers();
  const { groups, groupsLoading, getTeacherGroups, groupsError } = useGetTeacherGroups();
  const { isEventCreated, eventCreationError, eventCreationLoading, createEvent, resetEventCreationSuccess } =
    useCreateEvent();
  const { isEventUpdated, updateEvent, eventUpdateError, eventUpdateLoading, resetEventUpdateSuccess } =
    useUpdateEvent();
  const { isEventDeleted, deleteEvent, eventDeleteError, eventDeleteLoading, resetEventDeleteSuccess } =
    useDeleteEvent();
  const { showBoundary } = useErrorBoundary();

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEvent({});
  }, []);

  const handleDialogOpen = useCallback(
    (eventData?: any) => {
      if (eventData) {
        setEvent({
          ...eventData,
          changeMode: event.pattern === 'once' ? ChangeMode.ALL : ChangeMode.ONCE,
          date: date.format(),
        });
        if (eventData.teacherId) {
          getTeacherGroups(eventData.teacherId);
        }
      }
      setDialogOpen(true);
    },
    [getTeacherGroups],
  );

  const handleDateChange = useCallback((newDate: any) => {
    setDate(newDate);
  }, []);

  const handleSubmitStart = () => {
    setShouldUpdateSubmissionData({
      startedSubmitProcess: true,
      date: true,
      ids: true,
      slots: true,
      changeModeConfirmed: false,
    });
  };

  const cancelSubmit = () => {
    setShouldUpdateSubmissionData({
      startedSubmitProcess: false,
      date: false,
      ids: false,
      slots: false,
      changeModeConfirmed: false,
    });
  };

  const updateSubmissionData = useCallback((inputData: any) => {
    setEvent((curData: any) => ({ ...curData, ...inputData }));
  }, []);

  const checkSubmissionStatus = useCallback((key: keyof typeof shouldUpdateSubmissionData, status: boolean) => {
    setShouldUpdateSubmissionData((checks) => ({ ...checks, [key]: status }));
  }, []);

  const updateDeleteChangeMode = useCallback((changeMode: ChangeMode) => {
    setDeletableEvent((curData: any) => ({ ...curData, changeMode }));
  }, []);

  const handleDeleteOpen = useCallback(
    (event: any) => {
      setDeletableEvent({
        ...event,
        changeMode: event.pattern === 'once' ? ChangeMode.ALL : ChangeMode.ONCE,
        date: date.format(),
      });
    },
    [date],
  );

  const handleDeleteClose = useCallback(() => {
    setDeletableEvent(null);
  }, []);

  const handleDelete = useCallback(() => {
    const { id, changeMode, date } = deletableEvent;
    deleteEvent({ id, changeMode, date });
    setDeletableEvent(null);
    handleDialogClose();
  }, [deletableEvent]);

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
  }, [dialogOpen, currentBranch]);

  useEffect(() => {
    if (currentBranch) {
      getEvents(currentBranch.name, date.format());
    }
  }, [currentBranch, date]);

  useEffect(() => {
    if (
      shouldUpdateSubmissionData.startedSubmitProcess &&
      !shouldUpdateSubmissionData.date &&
      !shouldUpdateSubmissionData.ids &&
      !shouldUpdateSubmissionData.slots
    ) {
      if (event.id && shouldUpdateSubmissionData.changeModeConfirmed) {
        updateEvent(event);
        checkSubmissionStatus('startedSubmitProcess', false);
      } else if (!event.id) {
        createEvent(event);
        checkSubmissionStatus('startedSubmitProcess', false);
      }
    }
  }, [shouldUpdateSubmissionData]);

  useEffect(() => {
    if (isEventCreated || isEventUpdated) {
      getEvents(currentBranch.name, date.format());
      setTimeout(() => {
        resetEventCreationSuccess();
        resetEventUpdateSuccess();
      }, 2000);
      setTimeout(() => handleDialogClose(), 500);
    }
  }, [isEventCreated, isEventUpdated]);

  useEffect(() => {
    if (isEventDeleted) {
      getEvents(currentBranch.name, date.format());
      setTimeout(() => {
        resetEventDeleteSuccess();
      }, 2000);
    }
  }, [isEventDeleted]);

  const error =
    eventsError || teachersError || groupsError || eventCreationError || eventUpdateError || eventDeleteError;

  return (
    currentBranch && (
      <Fragment>
        <Calendar
          rooms={currentBranch.room}
          events={events}
          date={date}
          handleDateChange={handleDateChange}
          getTeacherGroups={getTeacherGroups}
          teachers={teachers}
          teachersLoading={teachersLoading}
          groups={groups}
          groupsLoading={groupsLoading}
          shouldUpdateSubmissionData={shouldUpdateSubmissionData}
          updateSubmissionData={updateSubmissionData}
          checkSubmissionStatus={checkSubmissionStatus}
          dialogOpen={dialogOpen}
          handleDialogOpen={handleDialogOpen}
          handleDialogClose={handleDialogClose}
          handleSubmitStart={handleSubmitStart}
          cancelSubmit={cancelSubmit}
          event={event}
          deletableEvent={deletableEvent}
          updateDeleteChangeMode={updateDeleteChangeMode}
          handleDeleteOpen={handleDeleteOpen}
          handleDeleteClose={handleDeleteClose}
          handleDelete={handleDelete}
        />
        {(isEventCreated || isEventDeleted || isEventUpdated) && (
          <TopCenterSnackbar message="Success" open={isEventCreated || isEventDeleted || isEventUpdated} />
        )}
        {error && showBoundary(error)}
      </Fragment>
    )
  );
}
