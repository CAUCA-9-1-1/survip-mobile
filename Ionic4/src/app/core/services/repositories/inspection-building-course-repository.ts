import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import {FirestationRepositoryProvider} from './firestation-repository-provider.service';
import {RouteDirectionRepositoryProvider} from './route-direction-repository';
import {LaneRepositoryProvider} from './lane-repository';
import { InspectionBuildingCourse } from 'src/app/shared/models/inspection-building-course';
import { InspectionBuildingCourseForList } from 'src/app/shared/models/inspection-building-course-for-list';
import { InspectionBuildingCourseLane } from 'src/app/shared/models/inspection-building-course-lane';
import { RouteDirection } from 'src/app/shared/models/route-direction';
import { FirestationForlist } from 'src/app/shared/models/firestation';

@Injectable()
export class InspectionBuildingCourseRepositoryProvider {

  private baseKey: string = 'building_courses_';

  public currentCourse: InspectionBuildingCourse;

  constructor(
    private storage: OfflineStorage,
    private directionRepo: RouteDirectionRepositoryProvider,
    private laneRepo: LaneRepositoryProvider,
    private firestationRepo: FirestationRepositoryProvider,
  ) {
    }

  public async getList(idBuilding: string, idCity: string): Promise<InspectionBuildingCourseForList[]> {
    const fireStations = await this.firestationRepo.getList(idCity);

    return this.storage.get(this.baseKey + idBuilding)
      .then(items => items.filter(item => item.isActive).map(item => this.getForList(fireStations, item)));
  }

  public async load(idBuilding: string, idBuildingCourse: string): Promise<any> {
    this.currentCourse = (await this.storage.get(this.baseKey  + idBuilding)).find(c => c.id === idBuildingCourse);

    if (this.currentCourse == null) {
      this.currentCourse = new InspectionBuildingCourse();
      this.currentCourse.id = idBuildingCourse;
      this.currentCourse.isActive = true;
      this.currentCourse.lanes = [];
      this.currentCourse.idBuilding = idBuilding;
    } else {
      await this.setLanesDescription(this.currentCourse.lanes);
    }
  }

  private async setLanesDescription(lanes: InspectionBuildingCourseLane[]): Promise<any> {
    const directions = await this.directionRepo.getList();
    lanes.forEach(lane => lane.description = this.getLaneName(lane, directions));
  }

  private getLaneName(lane: InspectionBuildingCourseLane, directions: RouteDirection[]): string {
    let name = this.laneRepo.getName(lane.idLane);
    if (lane.direction !== 2) {
      name += ' (' + directions.find(d => d.id === lane.direction).description + ')';
    }
    return name;
  }

  private getForList(fireStations: FirestationForlist[], course: InspectionBuildingCourse): InspectionBuildingCourseForList {
    const item = new InspectionBuildingCourseForList();
    item.id = course.id;
    const fireStation = fireStations.find(f => f.id === course.idFirestation);
    item.description = fireStation != null ? fireStation.name : '';
    return item;
  }

  public async save(): Promise<any> {

    const list = await this.storage.get(this.baseKey  + this.currentCourse.idBuilding);
    const currentItem = this.getCurrentItem(list, this.currentCourse);
    currentItem.hasBeenModified = true;

    return this.storage.set(this.baseKey  + this.currentCourse.idBuilding, list);
  }

  public async delete(): Promise<any> {

    const list = await this.storage.get(this.baseKey  + this.currentCourse.idBuilding);
    const currentItem = list.filter(s => s.id === this.currentCourse.id)[0];
    Object.assign(currentItem, this.currentCourse);
    currentItem.isActive = false;
    currentItem.hasBeenModified = true;

    return this.storage.set(this.baseKey  + this.currentCourse.idBuilding, list);
  }

  private getCurrentItem(list: InspectionBuildingCourse[], modifiedItem: InspectionBuildingCourse): InspectionBuildingCourse {
    const currentItem = list.filter(s => s.id === modifiedItem.id)[0];
    if (currentItem == null) {
      list.push(modifiedItem);
    } else {
      Object.assign(currentItem, modifiedItem);
    }
    return currentItem || modifiedItem;
  }
}
