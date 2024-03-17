import { Body, Controller, Get, Header, Param, Post } from '@nestjs/common';
import { PoiRecord } from './poi.record';
import { PoiService } from './poi.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('poi')
@ApiTags('Poi Resource')
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get('find/all')
  @Header('content-type', 'application/json')
  @ApiOkResponse({
    description:
      'get all points-of-interest irrespective of the specific poi type',
    type: [PoiRecord],
  })
  async findAllPoi(): Promise<PoiRecord[]> {
    return (await this.poiService.pois({})).map((poi) =>
      PoiRecord.fromPoiEntity(poi),
    );
  }

  @Get('find/:poiType/all')
  @Header('content-type', 'application/json')
  @ApiOkResponse({
    description: 'get all points-of-interest for a specific poi type',
    type: [PoiRecord],
  })
  async findAllPoiByType(
    @Param('poiType') poiType: string,
  ): Promise<PoiRecord[]> {
    return (await this.poiService.pois({ where: { type: poiType } })).map(
      (poi) => PoiRecord.fromPoiEntity(poi),
    );
  }

  @Post('init/preset/park')
  @Header('content-type', 'text/plain')
  @ApiCreatedResponse({
    description: 'preset points-of-interest for parks created',
    type: String,
  })
  async initPresetNationalpark(): Promise<string> {
    const count = await this.poiService.insertPresetPoiRecordsOfTypePark();
    return 'inserted ' + count + " preset poi record(s) for type 'park'";
  }

  @Post('init/custom/:poiType')
  @Header('content-type', 'text/plain')
  @ApiCreatedResponse({
    description: 'custom points-of-interest for a specific type created',
    type: String,
  })
  async loadCustomPoiForType(
    @Param('poiType') poiType: string,
    @Body() records: PoiRecord[],
  ): Promise<string> {
    const count = await this.poiService.insertCustomPoiRecordsForType(
      poiType,
      records,
    );
    return (
      'inserted ' + count + " custom poi record(s) for type '" + poiType + "'"
    );
  }
}
