import path from "path";
import fs from 'fs';
import multer from "multer";

const uploadDir = path.join(__dirname, '../../uploads');
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb: CallableFunction) => {
    cb(null, uploadDir);
  },
  filename: (_, file: Express.Multer.File, cb: CallableFunction) => {
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 5 * 1024 * 1024 }
});

export default upload;