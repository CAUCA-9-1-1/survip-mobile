import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { InspectionBuildingContact } from 'src/app/shared/models/inspection-building-contact';

@Injectable()
export class BuildingContactRepositoryProvider {

    private baseKey: string = 'building_contacts_';

    constructor(private storage: OfflineStorage) {
    }

    public getList(idBuilding: string): Promise<InspectionBuildingContact[]> {
      return this.storage.get(this.baseKey + idBuilding)
        .then(contacts => contacts.filter(contact => contact.isActive));
    }

    public async get(idBuilding: string, idBuildingContact: string): Promise<InspectionBuildingContact> {
        return (await this.storage.get(this.baseKey  + idBuilding)).filter(c => c.id === idBuildingContact)[0];
    }

    public async save(modifiedItem: InspectionBuildingContact): Promise<any> {

      const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
      const currentItem = this.getCurrentItem(list, modifiedItem);
      currentItem.hasBeenModified = true;
      return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
    }

    public async delete(modifiedItem: InspectionBuildingContact): Promise<any> {

      const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
      const currentItem = this.getCurrentItem(list, modifiedItem);
      currentItem.isActive = false;
      currentItem.hasBeenModified = true;

      return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
    }

    private getCurrentItem(list: InspectionBuildingContact[], modifiedItem: InspectionBuildingContact): InspectionBuildingContact {
      const currentItem = list.filter(s => s.id === modifiedItem.id)[0];
      if (currentItem == null) {
        list.push(modifiedItem);
      } else {
        Object.assign(currentItem, modifiedItem);
      }
      return currentItem || modifiedItem;
    }

    public async getOwnerName(idBuilding: string): Promise<string> {
      const contacts = await this.getList(idBuilding);
      const ownerContact = contacts.find(contact => contact.isOwner);
      if (ownerContact != null) {
        return ownerContact.firstName + ' ' + ownerContact.lastName;
      } else {
        return '';
      }
  }
}
