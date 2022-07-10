import { BadRequestException } from '@nestjs/common';

export const fileFilter = (req, file, cb) => {
  const whitelist = ['text/csv'];

  if (!whitelist.includes(file.mimetype)) {
    cb(null, false);
    return cb(new BadRequestException('Only accept csv files'));
  }

  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > 10485760) {
    cb(null, false);
    return cb(new BadRequestException('Max file size is 10MB'));
  }
  return cb(null, true);
};
