import moment from 'moment';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import { Calendar } from 'src/app/components/Calendar/Calendar';
import { EventDialog } from 'src/app/components/Calendar/EventDialog';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useCreateEvent, useDeleteEvent, useGetEvents } from './hooks/events';
import { useGetTeacherGroups, useGetTeachers } from './hooks/teacher';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { ConfirmationDialog } from 'src/app/components/Confirmation';
import { ChangeModeDialog } from 'src/app/components/Calendar/ChangeModeDialog';
import { ChangeMode } from 'src/app/types/changeMode';

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
  const [deletableEvent, setDeletableEvent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { events, eventsLoading, eventsError, getEvents } = useGetEvents();
  const { teachers, teachersLoading, getTeachers } = useGetTeachers();
  const { groups, groupsLoading, getTeacherGroups } = useGetTeacherGroups();
  const {
    isEventCreated,
    studentCreationLoading,
    createEvent,
    resetEventCreationSuccess,
    studentCreationError,
  } = useCreateEvent();
  const {
    isEventDeleted,
    deleteEvent,
    eventDeleteError,
    eventDeleteLoading,
    resetEventDeleteSuccess,
  } = useDeleteEvent();

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEvent({});
  }, []);

  const handleDialogOpen = useCallback(
    (eventData?: any) => {
      if (eventData) {
        setEvent(eventData);
        if (eventData.teacherId) {
          getTeacherGroups(eventData.teacherId);
        }
      }
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
    [date]
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
      createEvent(event);
      checkSubmissionStatus('startedUpdates', false);
    }
  }, [shouldUpdateSubmissionData]);

  useEffect(() => {
    if (isEventCreated /* ,  */) {
      getEvents(currentBranch.name, date.format());
      setTimeout(() => {
        resetEventCreationSuccess();
        // resetStudentUpdateSuccess();
      }, 2000);
      setTimeout(() => handleDialogClose(), 500);
    }
  }, [isEventCreated /* , isStudentUpdated */]);

  useEffect(() => {
    if (isEventDeleted) {
      getEvents(currentBranch.name, date.format());
      setTimeout(() => {
        resetEventDeleteSuccess();
      }, 2000);
    }
  }, [isEventDeleted]);

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
            event={event}
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
            handleDeleteOpen={handleDeleteOpen}
          />
        )}
        {deletableEvent &&
          (deletableEvent.pattern === 'once' ? (
            <ConfirmationDialog
              open={Boolean(
                deletableEvent && deletableEvent.pattern === 'once'
              )}
              onConfirm={handleDelete}
              onCancel={handleDeleteClose}
              message="Are you sure you want to delete this lesson?"
            />
          ) : (
            <ChangeModeDialog
              message="Deleting Lesson"
              value={deletableEvent.changeMode}
              handleChange={updateDeleteChangeMode}
              onCancel={handleDeleteClose}
              onConfirm={handleDelete}
              open={Boolean(
                deletableEvent && deletableEvent.pattern !== 'once'
              )}
            />
          ))}
        {(isEventCreated || isEventDeleted) && (
          <TopCenterSnackbar
            message="Success"
            open={isEventCreated || isEventDeleted}
          />
        )}
      </Fragment>
    )
  );
}
