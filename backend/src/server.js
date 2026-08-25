import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const uploadsDir = path.join(__dirname, '../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
]);

const extensionByType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf'
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeBase = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 48) || 'upload';
    const unique = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${safeBase}-${unique}${extensionByType[file.mimetype] || ''}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) {
      return cb(new Error('Unsupported file type. Please upload JPG, PNG, WEBP or PDF.'));
    }
    cb(null, true);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'FileVault API' });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please select a file to upload.' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(req.file.filename)}`;

  res.status(201).json({
    message: 'File uploaded successfully.',
    file: {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      url: fileUrl,
      storedName: req.file.filename
    }
  });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File is larger than the 10 MB limit.'
      : 'Upload could not be completed.';
    return res.status(400).json({ message });
  }

  res.status(400).json({ message: err.message || 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`FileVault API running on http://localhost:${PORT}`);
});
