# AI Assistant UI Elements & Button Reference

## 🎯 Quick Reference for UI Actions

### Role-Based Button Mapping

| Role | Component | Button / Action | Description |
|------|-----------|-----------------|-------------|
| **Clinician** | New Encounter | 🤖 Show/Hide AI Assistant | Toggle AI panel visibility |
| **Clinician** | AI Document Upload | 📤 Upload & Analyze | Upload document and trigger complete AI workflow |
| **Clinician** | AI Document Upload | 📄 Choose File | Select document from file system |
| **Clinician** | CDSS Panel | ✓ Accept | Accept AI recommendation |
| **Clinician** | CDSS Panel | ✗ Reject | Reject AI recommendation |
| **Clinician** | Encounter Form | 🤖 Apply AI Recommendations | Auto-fill diagnosis/treatment from AI |
| **Clinician** | Dashboard | View AI Summary | See comprehensive AI analysis for patient |
| **Receptionist** | Patient Check-in | Upload Documents | Upload patient documents only (no AI access) |
| **Patient** | Patient Portal | Upload Documents | Upload prescriptions/lab results |
| **Patient** | Patient Portal | View Recommendations | View doctor-approved AI recommendations |

---

## 📋 Component-Specific UI Elements

### 1. NewEncounter Component

#### Header Actions
```jsx
<button className="btn-ai-toggle">
  🤖 Show/Hide AI Assistant
</button>
```
- **Visibility:** Clinician & Admin only
- **Action:** Toggles AI panel with tabs
- **Style:** Purple gradient, elevated shadow

#### Tab Navigation (when AI panel shown)
```jsx
<button className="tab-button">📝 Encounter Form</button>
<button className="tab-button">📤 AI Document Upload</button>
<button className="tab-button">🤖 AI Analysis & CDSS</button>
```
- **Visibility:** Clinician & Admin only
- **Action:** Switch between form, upload, and AI summary views
- **Style:** Active tab has purple gradient background

#### Assessment & Plan Section
```jsx
<button className="btn-apply-ai">
  🤖 Apply AI Recommendations
</button>
```
- **Visibility:** Shown when recommendations exist
- **Action:** Auto-fills diagnosis and treatment fields with AI suggestions
- **Style:** Small purple gradient button

---

### 2. DocumentUpload Component

#### Upload Button
```jsx
<button className="btn-primary">
  📤 Upload & Analyze
</button>
```
- **Action:** 
  1. Uploads document to server
  2. Triggers OCR processing
  3. Extracts medical entities
  4. Maps to ontologies
  5. Generates CDSS recommendations
- **States:** 
  - Normal: "📤 Upload & Analyze"
  - Uploading: "📤 Uploading..."
  - Analyzing: "🤖 Analyzing..."

#### File Selection
```jsx
<label className="file-input-label">Choose File</label>
```
- **Action:** Opens file picker
- **Accepts:** Images (JPG, PNG, etc.) and PDFs
- **Style:** Blue button in drag-drop area

#### Clear Button
```jsx
<button className="btn-secondary">Clear</button>
```
- **Action:** Clears selected file
- **Visibility:** Shown when file is selected

---

### 3. CDSSPanel Component

#### Recommendation Actions
```jsx
<button className="btn-accept">✓ Accept</button>
<button className="btn-reject">✗ Reject</button>
```
- **Visibility:** Clinicians only, per recommendation
- **Action:** Marks recommendation as reviewed and accepted/rejected
- **Style:** Green (accept) / Red (reject)

#### Filter/Sort Options (future enhancement)
- Filter by severity (Urgent, Warning, Normal, Info)
- Filter by type (Diagnosis, Treatment, Alert, Follow-up)
- Sort by confidence score

---

### 4. AISummaryDashboard Component

#### Statistics Cards
- **Documents:** Total and processed counts
- **Entities:** Total extracted entities
- **Recommendations:** Total with urgent/warning breakdown

#### Interactive Elements
- OCR text collapsible section
- Entity type cards (clickable for details)
- Ontology code chips (clickable for external reference)
- Recommendation preview cards

---

## 🎨 UI Element Specifications

### Buttons

#### Primary Actions (AI-related)
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
padding: 12px 24px;
border-radius: 8px;
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
```
Examples: Upload & Analyze, Show AI Assistant, Apply AI Recommendations

#### Accept Actions
```css
background-color: #4caf50;
color: white;
padding: 10px 20px;
border-radius: 6px;
```

#### Reject Actions
```css
background-color: #f44336;
color: white;
padding: 10px 20px;
border-radius: 6px;
```

#### Secondary Actions
```css
background-color: #95a5a6;
color: white;
padding: 10px 20px;
border-radius: 6px;
```

---

### Severity Indicators

#### Urgent
```css
border-left: 6px solid #c62828;
background-color: #ffebee;
```
Icon: 🚨

#### Warning
```css
border-left: 6px solid #ef6c00;
background-color: #fff3e0;
```
Icon: ⚠️

#### Normal
```css
border-left: 6px solid #4caf50;
background-color: #f1f8e9;
```
Icon: ✓

#### Info
```css
border-left: 6px solid #1976d2;
background-color: #e3f2fd;
```
Icon: ℹ️

---

### Icons & Emojis

| Category | Icon | Usage |
|----------|------|-------|
| AI/Bot | 🤖 | AI-related actions |
| Upload | 📤 | Document upload |
| Document | 📄 | File/document reference |
| Analysis | 🔍 | Analysis/diagnostic actions |
| Medication | 💊 | Medication entities |
| Lab | 🧪 | Lab values |
| Heart | ❤️ | Vital signs |
| Alert | 🔔 | Notifications |
| Calendar | 📅 | Follow-up recommendations |
| Check | ✓ | Accept/Success |
| Cross | ✗ | Reject/Cancel |
| Info | ℹ️ | Information |
| Warning | ⚠️ | Warning level |
| Urgent | 🚨 | Urgent level |

---

## 📱 Responsive Design

### Desktop (>768px)
- Full side-by-side layout
- All features visible
- Tab navigation horizontal

### Tablet (768px - 1024px)
- Stacked layout
- Collapsible sections
- Full feature set

### Mobile (<768px)
- Single column
- Accordion-style sections
- Essential features prioritized
- Tab navigation vertical/dropdown

---

## ♿ Accessibility

### Keyboard Navigation
- **Tab:** Navigate through interactive elements
- **Enter/Space:** Activate buttons
- **Arrow Keys:** Navigate tabs
- **Esc:** Close modals/panels

### Screen Readers
- All buttons have descriptive labels
- ARIA labels for icons
- Status updates announced
- Progress indicators accessible

### Color Contrast
- All text meets WCAG AA standards
- Icons supplement color coding
- High contrast mode support

---

## 🎬 User Workflows

### Workflow 1: Quick Document Analysis (Clinician)
1. Click "🤖 Show AI Assistant"
2. Navigate to "📤 AI Document Upload"
3. Drag & drop document
4. Click "📤 Upload & Analyze"
5. Wait for processing (shows spinner)
6. Auto-redirect to "🤖 AI Analysis & CDSS" tab
7. Review recommendations
8. Click "✓ Accept" or "✗ Reject" for each
9. Return to "📝 Encounter Form"
10. Click "🤖 Apply AI Recommendations"
11. Submit encounter

### Workflow 2: Manual Document Review
1. Upload document
2. Click "Process OCR" (if not auto-processed)
3. Review extracted text
4. Click "Extract Entities"
5. Review entity list
6. Click "Map Ontologies"
7. Review ontology codes
8. Click "Generate Recommendations"
9. Review CDSS output
10. Accept/reject recommendations

---

## 🔧 Configuration Options

### Admin Settings (Future)
- Enable/disable AI features per role
- Configure confidence score thresholds
- Customize CDSS rules
- Set document type categories
- Configure ontology API endpoints

---

## 📊 Analytics Dashboard (Future)

### Metrics to Track
- Documents processed per day
- Average processing time
- Recommendation acceptance rate
- Most common diagnoses
- Entity extraction accuracy
- User engagement with AI features

---

## 🚨 Error States

### Upload Errors
```
⚠️ Upload Failed
- File too large (max 10MB)
- Invalid file type
- Network error
```

### Processing Errors
```
⚠️ Processing Failed
- OCR service unavailable
- Text extraction failed
- Entity recognition error
```

### API Errors
```
⚠️ API Error
- Connection timeout
- Server error (500)
- Unauthorized (401)
```

---

## 💡 Tips for Users

### For Clinicians
- Upload documents early in the encounter
- Review AI recommendations carefully before applying
- Use the confidence score as a guide
- Add your own notes to complement AI insights

### For Receptionists
- Ensure documents are clear and readable
- Select correct document type
- Verify patient selection before upload

### For Patients
- Upload documents as soon as received
- Check for approved recommendations regularly
- Contact your doctor if questions about AI suggestions

---

## 📞 Support

If you encounter issues with any UI element:
1. Check user role permissions
2. Verify browser compatibility (Chrome, Firefox, Safari, Edge)
3. Clear browser cache and cookies
4. Check network connectivity
5. Contact technical support

---

**Last Updated:** December 28, 2025
**Version:** 1.0.0
