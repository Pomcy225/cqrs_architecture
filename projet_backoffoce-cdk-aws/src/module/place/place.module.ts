import { Module } from '@nestjs/common';

import { PlaceService } from './services/place.service';
import { CategorieService } from './services/categorie.service';
import { VilleService } from './services/ville.service';
import { CommentaireService } from './services/commentaire.service';
import { HoraireService } from './services/horaire.service';
import { LienService } from './services/lien.service';
import { PharmacieService } from './services/pharmacie.service';
import { ImageService } from './services/image.service';

import { PlaceController } from './controllers/place.controller';
import { CategorieController } from './controllers/categorie.controller';
import { CommentaireController } from './controllers/commentaire.controller';
import { LienController } from './controllers/lien.controller';
import { PharmacieController } from './controllers/pharmacie.controller';
import { VilleController } from './controllers/ville.controller';
import { ImageController } from './controllers/image.controller';
import { DBUtil } from 'src/utils/db-utils';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';

@Module({
  imports: [],
  providers: [
    CategorieService,
    CommentaireService,
    HoraireService,
    LienService,
    PharmacieService,
    ImageService,
    PlaceService,
    VilleService,
    DBUtil,
    ApiResponseService,
  ],
  controllers: [
    CategorieController,
    CommentaireController,
    LienController,
    PharmacieController,
    VilleController,
    ImageController,
    PlaceController,
  ],
})
export class PlaceModule {}
