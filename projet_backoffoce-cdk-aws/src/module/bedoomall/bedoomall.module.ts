import { Module } from '@nestjs/common';
import { CategorieService } from './services/categorie.service';
import { CategorieController } from './controllers/categorie.controller';
import { CommentaireController } from './controllers/commentaire.controller';

import { DBUtil } from 'src/utils/db-utils';
import { CommentaireService } from './services/commentaire.service';
import { CommandeService } from './services/commande.service';
import { BoutiqueService } from './services/boutique.service';
import { CommandeController } from './controllers/commande.controller';
import { BoutiqueController } from './controllers/boutique.controller';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';

@Module({
  imports: [],
  providers: [
    CategorieService,
    CommentaireService,
    CommandeService,
    BoutiqueService,
    DBUtil,
    ApiResponseService,
  ],
  controllers: [
    CategorieController,
    CommentaireController,
    CommandeController,
    BoutiqueController,
  ],
})
export class BedooMallModule {}
