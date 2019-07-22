import { Component, OnInit } from '@angular/core';
import { HazardousMaterialForList } from 'src/app/shared/models/hazardous-material-for-list';
import { ModalController } from '@ionic/angular';
import { HazardousMaterialRepositoryProvider } from 'src/app/core/services/repositories/hazardous-material-repository';

@Component({
  selector: 'app-hazardous-material-selection',
  templateUrl: './hazardous-material-selection.component.html',
  styleUrls: ['./hazardous-material-selection.component.scss'],
})
export class HazardousMaterialSelectionComponent implements OnInit {

  public searchTerm: string = '';
  public hazardousMaterials: HazardousMaterialForList[] = [];

  constructor(
    private matRepo: HazardousMaterialRepositoryProvider,
    private modalController: ModalController
  ) {
    this.matRepo.getFiltered(this.searchTerm.trim())
      .then(materials => this.hazardousMaterials = materials);
  }

  ngOnInit() { }

  public onSearch() {
    this.matRepo.getFiltered(this.searchTerm.trim())
      .then(materials => this.hazardousMaterials = materials);
  }

  public onSelectMaterial(material: HazardousMaterialForList) {
    this.modalController.dismiss({ hasSelected: true, selectedMaterial: material });
  }

  public onCancel() {
    this.modalController.dismiss({ hasSelected: false });
  }
}
