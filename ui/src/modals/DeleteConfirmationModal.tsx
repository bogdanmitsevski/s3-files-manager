import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface DeleteConfirmationModalProps {
  open: boolean;
  fileName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmationModal = ({
  open,
  fileName,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Delete File
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
          disabled={isDeleting}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 0 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <WarningAmberIcon
            sx={{ fontSize: 64, color: 'warning.main', mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            Are you sure?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You are about to delete:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              mt: 1,
              wordBreak: 'break-word',
            }}
          >
            {fileName}
          </Typography>
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 2 }}
          >
            This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isDeleting}
          sx={{
            minWidth: 100,
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
