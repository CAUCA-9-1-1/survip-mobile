import {Inspection} from '../interfaces/inspection.interface';

export class Batch {
  public id: string;
  public description: string;
  public inspections: Inspection[];
}
