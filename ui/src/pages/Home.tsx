import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store/store';
import { openUploadModal } from '@store/filesSlice';
import FilesTable from '@tables/FilesTable';
import UploadModal from '@modals/UploadModal';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  padding: theme.spacing(3),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(3),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > button': {
      width: '100%',
    },
  },
}));

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenUploadModal = () => {
    dispatch(openUploadModal());
  };

  return (
    <GradientBox>
      <Container maxWidth="lg">
        <HeaderBox>
          <Box>
            <Typography variant="h1" color="white" gutterBottom>
              File Storage Manager
            </Typography>
            <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
              Upload, manage, and organize your files
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            onClick={handleOpenUploadModal}
            startIcon={<CloudUploadIcon />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
              fontWeight: 600,
              minWidth: 160,
            }}
          >
            Upload Files
          </Button>
        </HeaderBox>

        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, overflow: 'hidden' }}>
          <FilesTable />
        </Box>

        <UploadModal />
      </Container>
    </GradientBox>
  );
};

export default HomePage;