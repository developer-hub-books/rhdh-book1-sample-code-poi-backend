import { ApiProperty } from '@nestjs/swagger';
import { Poi } from '@prisma/client';

export class PoiRecord {
  constructor(name: string, description: string, coordinates: Array<number>) {
    this.name = name;
    this.description = description;
    this.coordinates = coordinates;
  }
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [Number] })
  coordinates: Array<number>;

  static fromPoiEntity(poiEntity: Poi): PoiRecord {
    return new PoiRecord(poiEntity.name, poiEntity.description, [
      poiEntity.latitude,
      poiEntity.longitude,
    ]);
  }
}
