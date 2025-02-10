import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudStorageService {
  private readonly logger = new Logger(CloudStorageService.name);
  private storage: Storage;
  private bucketName: string;

  constructor() {
    const credentials = process.env.GCS_KEY;

    if (!credentials) {
      this.logger.error('Google Cloud Storage credentials are missing.');
      throw new Error('Google Cloud Storage credentials are missing.');
    }

    this.storage = new Storage({
      credentials: JSON.parse(credentials),
    });

    this.bucketName = 'cloud-pct';
  }

  async uploadBase64Image(base64Data: string): Promise<string> {
    try {
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid base64 string');
      }
      const mimeType = matches[1];
      const fileData = matches[2];

      const filename = `images/${uuidv4()}`;

      const buffer = Buffer.from(fileData, 'base64');

      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);

      await file.save(buffer, {
        metadata: { contentType: mimeType },
      });

      return file.publicUrl();
    } catch (error) {
      this.logger.error(`Erreur lors de l'upload vers GCS: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    try {
      await file.delete();
    } catch (err) {
      console.error('Erreur de suppression dans GCS:', err.message);
    }
  }
}
