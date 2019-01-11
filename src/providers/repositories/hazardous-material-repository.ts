import {Injectable} from '@angular/core';
import {HazardousMaterialForList} from '../../models/hazardous-material-for-list';
import {Storage as OfflineStorage} from "@ionic/storage";
import {StringUtilities} from "./string-utilities";

@Injectable()
export class HazardousMaterialRepositoryProvider {

  constructor(private storage: OfflineStorage) {
  }

  public async getFiltered(searchTerm: string): Promise<HazardousMaterialForList[]> {
    const searchTermWithoutDiacritics = StringUtilities.removeDiacritics(searchTerm).toUpperCase();
    const materials = await this.getAll();

    return materials.filter((material) => {
      const laneName = StringUtilities.removeDiacritics(material.name).toUpperCase();
      return laneName.indexOf(searchTermWithoutDiacritics) !== -1 || material.number.indexOf(searchTermWithoutDiacritics) != -1;
    }).filter((lane, index) => index < 30);
  }

  private async getAll(): Promise<HazardousMaterialForList[]> {
    return (await this.storage.get("hazardous_material")).data;
  }
}
