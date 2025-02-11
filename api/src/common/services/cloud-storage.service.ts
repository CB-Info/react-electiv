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

  async generateUploadSignedUrl(
    fileName: string,
  ): Promise<{ signedUrl: string; publicUrl: string }> {
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: expiresAt,
    };

    const [signedUrl] = await file.getSignedUrl(options);

    const publicUrl = file.publicUrl();

    return { signedUrl, publicUrl };
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
