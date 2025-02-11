import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery } from '../models/gallery.model';

@Injectable()
export class GalleryRepository extends BaseRepository<Gallery> {
  constructor(@InjectModel(Gallery.name) private galleryModel: Model<Gallery>) {
    super(galleryModel);
  }
}
