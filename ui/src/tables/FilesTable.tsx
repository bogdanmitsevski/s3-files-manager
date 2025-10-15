import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@store/store';
import {
  fetchFiles,
  deleteFile,
  setPage,
  setLimit,
  toggleSortOrder,
} from '@store/filesSlice';
import type { MediaFile } from '@store/filesSlice';
import { FilesUploadApi } from '@api/FilesUploadApi';
import DeleteConfirmationModal from '@modals/DeleteConfirmationModal';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  Stack,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { visuallyHidden } from '@mui/utils';
import { SortOrder } from '@interfaces/common.interface';
import { formatTimestamp } from '@utils'
const FilesTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { files, total, page, limit, sortBy, sortOrder, isLoading } = useSelector(
    (state: RootState) => state.files
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ id: number; fileName: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchFiles({ page, limit }));
  }, [dispatch, page, limit]);

  const handleDeleteClick = (id: number, fileName: string) => {
    setFileToDelete({ id, fileName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteFile(fileToDelete.id)).unwrap();
      if (files.length === 1 && page > 1) {
        dispatch(setPage(page - 1));
      } else {
        dispatch(fetchFiles({ page, limit }));
      }
      setDeleteModalOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const handleDownload = (url: string, fileName: string) => {
    FilesUploadApi.downloadFile(url, fileName);
  };

  const handleSort = (column: keyof MediaFile) => {
    dispatch(toggleSortOrder(column));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
    dispatch(setPage(1));
  };

  const sortedFiles = useMemo(() => {
    const sorted = [...files].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === SortOrder.ASC
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === SortOrder.ASC ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [files, sortBy, sortOrder]);

  

  if (isLoading && files.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const headCells: { id: keyof MediaFile; label: string }[] = [
    { id: 'id', label: 'ID' },
    { id: 'uploadedAt', label: 'Upload Date' },
    { id: 'fileName', label: 'Filename' },
    { id: 'extension', label: 'Extension' },
    { id: 'size', label: 'Size' },
  ];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sx={{ fontWeight: 'bold' }}
                  sortDirection={sortBy === headCell.id ? sortOrder : false}
                >
                  <TableSortLabel
                    active={sortBy === headCell.id}
                    direction={sortBy === headCell.id ? sortOrder : SortOrder.ASC}
                    onClick={() => handleSort(headCell.id)}
                  >
                    {headCell.label}
                    {sortBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {sortOrder === SortOrder.DESC ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    No files uploaded yet. Click "Upload Files" to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedFiles.map((file) => (
                <TableRow key={file.id} hover>
                  <TableCell>{file.id}</TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2">{formatTimestamp(file.uploadedAt)}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={file.fileName} arrow>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {file.fileName}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{file.extension}</TableCell>
                  <TableCell>{FilesUploadApi.formatFileSize(file.size)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(file.url, file.fileName)}
                        color="primary"
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(file.id, file.fileName)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          Total: {total} file{total !== 1 ? 's' : ''}
        </Typography>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 25]}
        />
      </Box>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        fileName={fileToDelete?.fileName || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </Paper>
  );
};

export default FilesTable;