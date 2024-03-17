import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BackendController } from './proxy/backend.controller';
import { PoiController } from './poi/poi.controller';
import { DbService } from './poi/db.service';
import { PoiService } from './poi/poi.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BackendController, PoiController],
  providers: [DbService, PoiService],
})
export class AppModule {}
