import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { FilesUploadApi } from '@api/FilesUploadApi'
import { SortOrder } from '@interfaces/common.interface';

export interface MediaFile {
  id: number;
  url: string;
  size: number;
  fileName: string;
  extension: string;
  uploadedAt: string;
}

export interface FilesState {
  files: MediaFile[];
  total: number;
  page: number;
  limit: number;
  sortBy: keyof MediaFile;
  sortOrder: SortOrder;
  isLoading: boolean;
  error: string | null;
  isUploadModalOpen: boolean;
}

const initialState: FilesState = {
  files: [],
  total: 0,
  page: 1,
  limit: 10,
  sortBy: 'id',
  sortOrder: SortOrder.DESC,
  isLoading: false,
  error: null,
  isUploadModalOpen: false,
};

export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async ({ page, limit, sortBy, sortOrder }: { page: number; limit: number; sortBy?: string; sortOrder?: string }, { rejectWithValue }) => {
    try {
      const response = await FilesUploadApi.fetchFiles(page, limit, sortBy, sortOrder);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch files');
    }
  }
);

export const uploadFiles = createAsyncThunk(
  'files/uploadFiles',
  async (files: File[], { rejectWithValue }) => {
    try {
      const response = await FilesUploadApi.uploadFiles(files);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to upload files');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (id: number, { rejectWithValue }) => {
    try {
      await FilesUploadApi.deleteFile(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete file');
    }
  }
);

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: keyof MediaFile; sortOrder: SortOrder }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    toggleSortOrder: (state, action: PayloadAction<keyof MediaFile>) => {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
      } else {
        state.sortBy = action.payload;
        state.sortOrder = SortOrder.DESC;
      }
    },
    openUploadModal: (state) => {
      state.isUploadModalOpen = true;
    },
    closeUploadModal: (state) => {
      state.isUploadModalOpen = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFiles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.files = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
    });
    builder.addCase(fetchFiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(uploadFiles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadFiles.fulfilled, (state) => {
      state.isLoading = false;
      state.isUploadModalOpen = false;
    });
    builder.addCase(uploadFiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteFile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteFile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.files = state.files.filter(file => file.id !== action.payload);
      state.total = state.total - 1;
    });
    builder.addCase(deleteFile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setPage,
  setLimit,
  setSorting,
  toggleSortOrder,
  openUploadModal,
  closeUploadModal,
  clearError,
} = filesSlice.actions;

export default filesSlice.reducer;

