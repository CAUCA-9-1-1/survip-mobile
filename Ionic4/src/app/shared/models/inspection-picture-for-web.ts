export class InspectionPictureForWeb {
  id: string;
  idParent: string;
  idPicture: string;
  dataUri: string;
  sketchJson: string;
  modified=false;

  isActive: boolean = true;
  hasBeenModified: boolean = false;
}
