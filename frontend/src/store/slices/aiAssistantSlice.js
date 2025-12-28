import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiAssistantService from '../../services/aiAssistantService';

// Async Thunks
export const uploadDocument = createAsyncThunk(
  'aiAssistant/uploadDocument',
  async ({ patientId, file, documentType }, { rejectWithValue }) => {
    try {
      const response = await aiAssistantService.uploadDocument(patientId, file, documentType);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const processOCR = createAsyncThunk(
  'aiAssistant/processOCR',
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await aiAssistantService.processOCR(documentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const extractEntities = createAsyncThunk(
  'aiAssistant/extractEntities',
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await aiAssistantService.extractEntities(documentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const mapOntologies = createAsyncThunk(
  'aiAssistant/mapOntologies',
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await aiAssistantService.mapOntologies(documentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateRecommendations = createAsyncThunk(
  'aiAssistant/generateRecommendations',
  async ({ documentId, additionalContext }, { rejectWithValue }) => {
    try {
      const response = await aiAssistantService.generateRecommendations(documentId, additionalContext);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const completeAnalysis = createAsyncThunk(
  'aiAssistant/completeAnalysis',
  async ({ documentId, additionalContext }, { rejectWithValue }) => {
    try {
      const response = await aiAssistantService.completeAnalysis(documentId, additionalContext);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPatientAISummary = createAsyncThunk(
  'aiAssistant/getPatientAISummary',
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await aiAssistantService.getPatientAISummary(patientId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const reviewRecommendation = createAsyncThunk(
  'aiAssistant/reviewRecommendation',
  async ({ recommendationId, isAccepted, reviewNotes }, { rejectWithValue }) => {
    try {
      const response = await aiAssistantService.reviewRecommendation(recommendationId, isAccepted, reviewNotes);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  // Current document being processed
  currentDocument: null,
  
  // OCR results
  ocrText: null,
  
  // Extracted entities
  entities: [],
  
  // Ontology mappings
  ontologyMappings: [],
  
  // CDSS recommendations
  recommendations: [],
  
  // Patient AI summary
  patientSummary: null,
  
  // Loading states
  loading: {
    upload: false,
    ocr: false,
    entities: false,
    ontology: false,
    recommendations: false,
    summary: false,
    completeAnalysis: false,
  },
  
  // Error states
  error: {
    upload: null,
    ocr: null,
    entities: null,
    ontology: null,
    recommendations: null,
    summary: null,
    completeAnalysis: null,
  },
};

// Slice
const aiAssistantSlice = createSlice({
  name: 'aiAssistant',
  initialState,
  reducers: {
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
      state.ocrText = null;
      state.entities = [];
      state.ontologyMappings = [];
      state.recommendations = [];
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
    clearErrors: (state) => {
      state.error = {
        upload: null,
        ocr: null,
        entities: null,
        ontology: null,
        recommendations: null,
        summary: null,
        completeAnalysis: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Upload Document
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.loading.upload = true;
        state.error.upload = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading.upload = false;
        state.currentDocument = action.payload;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading.upload = false;
        state.error.upload = action.payload;
      });

    // Process OCR
    builder
      .addCase(processOCR.pending, (state) => {
        state.loading.ocr = true;
        state.error.ocr = null;
      })
      .addCase(processOCR.fulfilled, (state, action) => {
        state.loading.ocr = false;
        state.ocrText = action.payload.ocrText;
      })
      .addCase(processOCR.rejected, (state, action) => {
        state.loading.ocr = false;
        state.error.ocr = action.payload;
      });

    // Extract Entities
    builder
      .addCase(extractEntities.pending, (state) => {
        state.loading.entities = true;
        state.error.entities = null;
      })
      .addCase(extractEntities.fulfilled, (state, action) => {
        state.loading.entities = false;
        state.entities = action.payload.entities || [];
      })
      .addCase(extractEntities.rejected, (state, action) => {
        state.loading.entities = false;
        state.error.entities = action.payload;
      });

    // Map Ontologies
    builder
      .addCase(mapOntologies.pending, (state) => {
        state.loading.ontology = true;
        state.error.ontology = null;
      })
      .addCase(mapOntologies.fulfilled, (state, action) => {
        state.loading.ontology = false;
        state.ontologyMappings = action.payload.mappings || [];
      })
      .addCase(mapOntologies.rejected, (state, action) => {
        state.loading.ontology = false;
        state.error.ontology = action.payload;
      });

    // Generate Recommendations
    builder
      .addCase(generateRecommendations.pending, (state) => {
        state.loading.recommendations = true;
        state.error.recommendations = null;
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.loading.recommendations = false;
        state.recommendations = action.payload.recommendations || [];
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.loading.recommendations = false;
        state.error.recommendations = action.payload;
      });

    // Complete Analysis
    builder
      .addCase(completeAnalysis.pending, (state) => {
        state.loading.completeAnalysis = true;
        state.error.completeAnalysis = null;
      })
      .addCase(completeAnalysis.fulfilled, (state, action) => {
        state.loading.completeAnalysis = false;
        state.ocrText = action.payload.ocrText;
        state.entities = action.payload.entities || [];
        state.recommendations = action.payload.recommendations || [];
      })
      .addCase(completeAnalysis.rejected, (state, action) => {
        state.loading.completeAnalysis = false;
        state.error.completeAnalysis = action.payload;
      });

    // Get Patient AI Summary
    builder
      .addCase(getPatientAISummary.pending, (state) => {
        state.loading.summary = true;
        state.error.summary = null;
      })
      .addCase(getPatientAISummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.patientSummary = action.payload;
      })
      .addCase(getPatientAISummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error.summary = action.payload;
      });

    // Review Recommendation
    builder.addCase(reviewRecommendation.fulfilled, (state, action) => {
      // Update the specific recommendation in the array
      const index = state.recommendations.findIndex(
        (rec) => rec.id === action.payload.recommendationId
      );
      if (index !== -1) {
        state.recommendations[index].isReviewed = true;
        state.recommendations[index].isAccepted = action.payload.isAccepted;
      }
    });
  },
});

// Export actions
export const { clearCurrentDocument, clearRecommendations, clearErrors } = aiAssistantSlice.actions;

// Export reducer
export default aiAssistantSlice.reducer;
