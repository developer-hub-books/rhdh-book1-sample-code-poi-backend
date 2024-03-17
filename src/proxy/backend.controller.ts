import { Controller, Get, Header, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';

export class Coordinates {
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;
}

export class Backend {
  @ApiProperty()
  id: string;
  @ApiProperty()
  displayName: string;
  @ApiProperty()
  coordinates: Coordinates;
  @ApiProperty()
  zoom: number;
}

@Controller('ws')
@ApiTags('Backend Resource')
export class BackendController {
  private poiBackendResourceInfo: string;

  constructor(private configService: ConfigService) {
    this.poiBackendResourceInfo = this.configService.get<string>(
      'POI_PARKS_RESOURCE_INFO',
    );
  }

  @Get('/info')
  @Header('content-type', 'application/json')
  @ApiOkResponse({
    description: 'get information about this registered backend',
    type: Backend,
  })
  getBackend(): Backend {
    Logger.log('backend info endpoint called');
    Logger.debug('returning backend ' + this.poiBackendResourceInfo);
    return JSON.parse(this.poiBackendResourceInfo) as Backend;
  }
}
