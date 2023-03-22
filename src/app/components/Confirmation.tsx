import { Button, Modal, Typography, Box, styled } from '@mui/material';

const StyledModal = styled(Modal)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: '8px',
  padding: theme.spacing(4),
  width: '400px',
}));

export function ConfirmationDialog({ message, onConfirm, onCancel, open }: any) {

  return (
      <StyledModal open={open} onClose={onCancel}>
        <ModalContent>
          <Typography variant="h6" component="h6" gutterBottom>
            {message || 'Are you sure?'}
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={onCancel} color="primary" variant="outlined">
              No
            </Button>
            <Button
              onClick={onConfirm}
              color="primary"
              variant="contained"
              autoFocus
              style={{ marginLeft: 8 }}
            >
              Yes
            </Button>
          </Box>
        </ModalContent>
      </StyledModal>
  );
}