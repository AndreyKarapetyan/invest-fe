import AddIcon from '@mui/icons-material/Add';
import { AdminStudentDialog } from 'src/app/components/admin/AdminStudentDialog';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import {
  Button,
  debounce,
  Fade,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  Tooltip,
} from '@mui/material';
import { ConfirmationDialog } from 'src/app/components/Confirmation';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { SearchField } from 'src/app/components/SearchField';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useGetTeacherGroups, useGetTeachers } from './hooks/teacher';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreatePayment, useDeletePayment, useGetPayments, useUpdatePayment } from './hooks/payment';
import { PaymentStatus } from 'src/app/types/payment';
import { AdminPaymentsDialog } from 'src/app/components/admin/AdminPaymentDialog';
import { useGetAllStudentsMinData } from './hooks/student';

export function AdminPayments() {
  const branchDetails = useContext<any>(BranchContext);
  const currentBranch = branchDetails?.name;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [deletablePayment, setDeletablePayment] = useState<number | null>(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const { getPayments, hasMore, payments, paymentsError, paymentsLoading } = useGetPayments();
  const { teachersError, teachers, teachersLoading, getTeachers } = useGetTeachers();
  const { groupsError, groups, groupsLoading, getTeacherGroups } = useGetTeacherGroups();
  const { createPayment, isPaymentCreated, paymentCreationError, paymentCreationLoading, resetPaymentCreationSuccess } =
    useCreatePayment();
  const { isPaymentUpdated, paymentUpdateError, paymentUpdateLoading, resetPaymentUpdateSuccess, updatePayment } =
    useUpdatePayment();
  const { deletePayment, isPaymentDeleted, paymentDeleteError, paymentDeleteLoading, resetPaymentDeleteSuccess } =
    useDeletePayment();
  const { students, getAllStudentsMinData, studentsError, studentsLoading  } = useGetAllStudentsMinData();
  const loadingTimeOut = useRef<any>();
  const { showBoundary } = useErrorBoundary();

  const debouncedGetPayments = useCallback(
    debounce((searchString: string) => {
      getPayments(currentBranch, true, searchString);
    }, 300),
    [currentBranch, getPayments],
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchString(value);
      debouncedGetPayments(value);
    },
    [debouncedGetPayments],
  );

  const loadMore = useCallback(() => {
    getPayments(currentBranch, false, searchString);
  }, [currentBranch, getPayments, searchString]);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleDialogOpen = useCallback(
    (paymentData?: any) => {
      // if (paymentData) {
      //   setPayment(paymentData);
      //   if (paymentData.teacherId) {
      //     getTeacherGroups(paymentData.teacherId);
      //   }
      // }
      getTeachers(currentBranch);
      setDialogOpen(true);
    },
    [currentBranch, getTeacherGroups, getTeachers],
  );

  const handleDialogSubmit = useCallback(
    (paymentData: any) => {
      createPayment({ ...paymentData, branchName: currentBranch });
    },
    [currentBranch],
  );

  const handleDeleteOpen = useCallback((paymentId: number) => {
    setDeletablePayment(paymentId);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setDeletablePayment(null);
  }, []);

  const handleDelete = useCallback(() => {
    deletePayment(deletablePayment as number);
    setDeletablePayment(null);
  }, [deletablePayment]);

  const handleStatusChange = useCallback(
    (paymentId: number, status: PaymentStatus) => {
      updatePayment(paymentId, { status });
    },
    [updatePayment],
  );

  useEffect(() => {
    if (currentBranch) {
      getPayments(currentBranch, true, searchString);
    }
  }, [currentBranch]);

  useEffect(() => {
    if (isPaymentCreated || isPaymentUpdated) {
      getPayments(currentBranch, true, searchString);
      setTimeout(() => {
        resetPaymentCreationSuccess();
        resetPaymentUpdateSuccess();
      }, 2000);
      setTimeout(() => handleDialogClose(), 500);
    }
  }, [isPaymentCreated, isPaymentUpdated]);

  useEffect(() => {
    if (isPaymentDeleted) {
      getPayments(currentBranch, true, searchString);
      setTimeout(() => {
        resetPaymentDeleteSuccess();
      }, 2000);
    }
  }, [isPaymentDeleted]);

  useEffect(() => {
    if (paymentCreationLoading || paymentUpdateLoading || paymentDeleteLoading) {
      loadingTimeOut.current = setTimeout(() => setIsLoadingShowing(true), 100);
    } else {
      clearTimeout(loadingTimeOut.current);
      setIsLoadingShowing(false);
    }
  }, [paymentCreationLoading, paymentUpdateLoading, paymentDeleteLoading]);

  const columns = useMemo(
    () => [
      { label: 'Id', name: 'id', Component: Fragment, withValue: true },
      { label: 'Student Name', name: 'studentName', Component: Fragment, withValue: true },
      { label: 'Student Lastname', name: 'studentLastname', Component: Fragment, withValue: true },
      { label: 'Group Name', name: 'groupName', Component: Fragment, withValue: true },
      { label: 'Teacher Name', name: 'teacherName', Component: Fragment, withValue: true },
      { label: 'Teacher Lastname', name: 'teacherLastname', Component: Fragment, withValue: true },
      { label: 'Payment Amount', name: 'amount', Component: Fragment, withValue: true },
      { label: 'Date', name: 'createdAt', Component: Fragment, withValue: true },
      {
        label: 'Status',
        name: 'status',
        Component: ({ row }: any) => (
          <Select
            variant="standard"
            labelId="status-label"
            name="status"
            label="Status"
            disableUnderline
            MenuProps={{
              disableRestoreFocus: true,
            }}
            sx={{ marginLeft: '18%' }}
            value={row.status}
            onChange={({ target: { value } }) => handleStatusChange(row.id, value)}
          >
            <MenuItem value={PaymentStatus.Paid}>{PaymentStatus.Paid}</MenuItem>
            <MenuItem value={PaymentStatus.Waiting}>{PaymentStatus.Waiting}</MenuItem>
            <MenuItem value={PaymentStatus.Unpaid}>{PaymentStatus.Unpaid}</MenuItem>
          </Select>
        ),
        withValue: false,
      },
      {
        label: '',
        name: '',
        Component: ({ row }: any) => (
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteOpen(row.id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
        withValue: false,
      },
    ],
    [],
  );

  const error =
    paymentsError || teachersError || groupsError || paymentCreationError || paymentUpdateError || paymentDeleteError;

  const isSuccess = isPaymentCreated || isPaymentUpdated || isPaymentDeleted;

  return (
    <Grid width="80%" marginX="auto">
      <Grid container justifyContent="space-between" alignItems="center">
        <SearchField sx={{ marginY: 3, marginX: 2, width: '60vh' }} onChange={handleSearchChange} />
        <Button
          sx={{
            marginY: 3,
            marginX: 2,
            paddingY: 1,
            width: '200px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
          variant="outlined"
          onClick={() => handleDialogOpen()}
          startIcon={<AddIcon />}
        >
          New Payment
        </Button>
      </Grid>
      {paymentsLoading && (
        <Fade
          in={paymentsLoading}
          style={{
            transitionDelay: paymentsLoading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <LinearProgress />
        </Fade>
      )}
      <InfiniteLoadingTable columns={columns} rows={payments} loadMore={loadMore} hasMore={hasMore} />
      {dialogOpen && (
        <AdminPaymentsDialog
          handleSubmit={handleDialogSubmit}
          isOpen={dialogOpen}
          handleClose={handleDialogClose}
          teachers={teachers}
          teachersLoading={teachersLoading}
          groups={groups}
          groupsLoading={groupsLoading}
          getTeacherGroups={getTeacherGroups}
          students={students}
          studentsLoading={studentsLoading}
          getAllStudentsMinData={getAllStudentsMinData}
          branchName={currentBranch}
        />
      )}
      {isSuccess && <TopCenterSnackbar message="Success" open={isSuccess} />}
      {deletablePayment && (
        <ConfirmationDialog
          open={Boolean(deletablePayment)}
          onConfirm={handleDelete}
          onCancel={handleDeleteClose}
          message="Are you sure you want to delete this payment?"
        />
      )}
      {isLoadingShowing && <LoadingIndicator open={isLoadingShowing} />}
      {error && showBoundary(error)}
    </Grid>
  );
}
