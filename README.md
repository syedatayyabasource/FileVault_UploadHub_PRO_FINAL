# FileVault — Upload Hub

A polished full-stack file upload project built with React + Vite on the frontend and Node.js + Express + Multer on the backend.

## Features
- Drag-and-drop upload area
- Styled file picker
- Image/document preview
- Frontend type and size validation
- Upload progress indicator
- Backend validation and local storage
- Uploaded-file result card with preview/download
- Responsive UI
- Clear loading, success and error states

## Supported files
Images: JPG, JPEG, PNG, WEBP
Documents: PDF
Maximum size: 10 MB

## Run locally

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

The frontend expects the API at `http://localhost:5000/api`.

## Project structure
- `frontend/` — React UI
- `backend/` — Express API and local file storage
- `backend/uploads/` — uploaded files (created automatically)
