import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {InspectionQuestion} from "../../models/inspection-question";
import {InspectionQuestionRepositoryProvider} from "../../providers/repositories/inspection-question-repository-provider";

@IonicPage()
@Component({
  selector: 'page-inspection-question',
  templateUrl: 'inspection-question.html',
})
export class InspectionQuestionPage {
    @ViewChild(Slides) slides: Slides;

    public inspectionQuestion: InspectionQuestion[] = [];
    public idSurvey: string = '';
    public idInspection: string  = '';
    public SelectedIndex = 0;
    public CurrentQuestion: InspectionQuestion;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public controller: InspectionQuestionRepositoryProvider)
  {
      this.idSurvey = this.navParams.get('idSurvey');
      this.loadInspectionQuestion();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionQuestionPage');
  }

  loadInspectionQuestion()
  {
      this.controller.getList(this.idSurvey)
          .subscribe(result => {
              this.inspectionQuestion = result;
          });
      this.CurrentQuestion = this.inspectionQuestion[this.SelectedIndex];
  }

}
