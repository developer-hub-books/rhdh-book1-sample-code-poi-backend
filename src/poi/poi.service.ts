import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Poi, Prisma } from '@prisma/client';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { PoiRecord } from './poi.record';

export interface ParkRecord {
  countryCode: string;
  countryName: string;
  coordinates: Array<number>;
  name: string;
  toponymName: string;
}

@Injectable()
export class PoiService {
  private poiParksFile: string;
  private poiParksAutoLoad: string;
  private parksDataLoaded: boolean = false;

  constructor(
    private db: DbService,
    private configService: ConfigService,
  ) {
    this.poiParksFile = this.configService.get<string>('POI_PARKS_FILE');
    this.poiParksAutoLoad = this.configService.get<string>(
      'POI_PARKS_AUTO_LOAD',
    );
    if (this.poiParksAutoLoad.toLocaleLowerCase() === 'true') {
      Logger.debug('auto-loading parks data');
      this.insertPresetPoiRecordsOfTypePark();
    }
  }

  async insertPresetPoiRecordsOfTypePark(): Promise<number> {
    if (this.parksDataLoaded) {
      Logger.debug(
        'parks data has already been initialized either automatically or manually',
      );
      return 0;
    }
    const numParkPois = await this.db.poi.count({ where: { type: 'park' } });
    if (numParkPois !== undefined && numParkPois > 0) {
      Logger.debug(
        'parks data has already been initialized either automatically or manually',
      );
      return 0;
    }
    try {
      Logger.debug('parsing parks data from file ' + this.poiParksFile);
      const lines: Buffer = readFileSync(this.poiParksFile);
      const pois = lines
        .toString()
        .split('\n')
        .filter((s) => s.length != 0)
        .map((l) => JSON.parse(l) as ParkRecord)
        .map((pr) => ({
          name: pr.name,
          latitude: pr.coordinates[0],
          longitude: pr.coordinates[1],
          type: 'park',
        }));
      Logger.debug('persist ' + pois.length + ' poi record(s)');
      //NOTE: createMany not supported when working with sqlite
      // pois.forEach(async (poi) => {
      //   await this.db.poi.create({ data: poi });
      // });
      await this.db.poi.createMany({ data: pois });
      this.parksDataLoaded = true;
      return pois.length;
    } catch (error) {
      console.error(
        `error: failed to read file ${this.poiParksFile} -> ${error.message}`,
      );
    }
  }

  async insertCustomPoiRecordsForType(
    poiType: string,
    records: PoiRecord[],
  ): Promise<number> {
    Logger.debug('mapping ' + records.length + ' record(s)');
    const pois = records.map((pr) => ({
      name: pr.name,
      latitude: pr.coordinates[0],
      longitude: pr.coordinates[1],
      type: poiType,
    }));
    Logger.debug(
      'persist ' +
        pois.length +
        " custom poi record(s) for type '" +
        poiType +
        "'",
    );
    //NOTE: createMany not supported when working with sqlite
    // pois.forEach(async (poi) => {
    //   await this.db.poi.create({ data: poi });
    // });
    await this.db.poi.createMany({ data: pois });
    return pois.length;
  }

  async pois(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PoiWhereUniqueInput;
    where?: Prisma.PoiWhereInput;
    orderBy?: Prisma.PoiOrderByWithRelationInput;
  }): Promise<Poi[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.db.poi.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  async createPoi(data: Prisma.PoiCreateInput): Promise<Poi> {
    return this.db.poi.create({
      data,
    });
  }
}
