import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as vision from '@google-cloud/vision';

@Injectable()
export class VisionApiService {
  private readonly logger = new Logger(VisionApiService.name);
  private visionClient: vision.ImageAnnotatorClient;

  constructor() {
    const credentials = process.env.GCS_KEY;

    if (!credentials) {
      this.logger.error('Google Cloud Vision credentials are missing.');
      throw new Error('Google Cloud Vision credentials are missing.');
    }

    this.visionClient = new vision.ImageAnnotatorClient({
      credentials: JSON.parse(credentials),
    });
  }

  async analyzeImage(imageUrl: string) {
    try {
      this.logger.log(`Analyse de l'image: ${imageUrl}`);

      const [result] = await this.visionClient.annotateImage({
        image: { source: { imageUri: imageUrl } },
        features: [
          { type: 'LABEL_DETECTION' },
          { type: 'SAFE_SEARCH_DETECTION' },
        ],
      });

      // 📌 Formate et retourne les résultats
      return this.processVisionResults(result);
    } catch (error) {
      this.logger.error(`Erreur d'analyse Vision API: ${error.message}`);
      throw new BadRequestException('Impossible d’analyser l’image.');
    }
  }

  private processVisionResults(result: any) {
    const labels =
      result.labelAnnotations?.map((label) => label.description) || [];
    const safeSearch = result.safeSearchAnnotation;

    return {
      labels,
      safeSearch: {
        adult: safeSearch?.adult,
        violence: safeSearch?.violence,
        racy: safeSearch?.racy,
      },
    };
  }
}
