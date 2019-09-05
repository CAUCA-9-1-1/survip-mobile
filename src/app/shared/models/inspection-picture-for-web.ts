export class InspectionPictureForWeb {
  id: string;
  idParent: string;
  idPicture: string;
  dataUri: string;
  sketchJson: string;
  modified: boolean = false;

  isActive: boolean = true;
  hasBeenModified: boolean = false;
}
