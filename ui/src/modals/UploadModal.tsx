import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@store/store';
import { uploadFiles, closeUploadModal, fetchFiles, clearError } from '@store/filesSlice';
import { FilesUploadApi } from '@api/FilesUploadApi';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Alert,
  styled,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const UploadZone = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isDragActive',
})<{ isDragActive: boolean }>(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6, 3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'background-color']),
  backgroundColor: isDragActive
    ? alpha(theme.palette.primary.main, 0.05)
    : theme.palette.background.default,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isUploadModalOpen, isLoading, error, page, limit } = useSelector(
    (state: RootState) => state.files
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setSelectedFiles([]);
    dispatch(clearError());
    dispatch(closeUploadModal());
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    try {
      await dispatch(uploadFiles(selectedFiles)).unwrap();
      setSelectedFiles([]);
      dispatch(fetchFiles({ page, limit }));
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

  return (
    <Dialog
      open={isUploadModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        Upload Files
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <UploadZone
          isDragActive={dragActive}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <VisuallyHiddenInput
            ref={fileInputRef}
            type="file"
            multiple
            accept={FilesUploadApi.getAcceptedFileTypes()}
            onChange={handleFileSelect}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag & drop files here or click to browse
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: PNG, JPG, JPEG, PDF
            <br />
            Max file size: 5MB | Max total size: 50MB
          </Typography>
        </UploadZone>

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Files ({selectedFiles.length})
            </Typography>
            <List disablePadding>
              {selectedFiles.map((file, index) => (
                <ListItem
                  key={index}
                  divider={index < selectedFiles.length - 1}
                  sx={{ px: 0 }}
                >
                  <ListItemText
                    primary={file.name}
                    secondary={FilesUploadApi.formatFileSize(file.size)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'right', mt: 1 }}
            >
              Total Size: {FilesUploadApi.formatFileSize(totalSize)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;