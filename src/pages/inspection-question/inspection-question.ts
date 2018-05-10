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
    public selectedIndex = 0;
    public CurrentQuestion: InspectionQuestion = new InspectionQuestion();
    public nextQuestionAvailable = true;
    public previousQuestionAvailable = true;
    public choiceAnswer: string = '';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public controller: InspectionQuestionRepositoryProvider,
              )
  {
      this.idSurvey = this.navParams.get('idSurvey');
      this.loadInspectionQuestion();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionQuestionPage');
      this.slides.lockSwipes(true);
  }

  loadInspectionQuestion()
  {
      this.controller.getList(this.idSurvey)
          .subscribe(result => {
              this.inspectionQuestion = result;
              this.CurrentQuestion = this.inspectionQuestion[this.selectedIndex];
          });

  }
    SwitchQuestion(){
        this.selectedIndex = this.slides.getActiveIndex();
        this.CurrentQuestion = this.inspectionQuestion[this.selectedIndex];

    }

    findQuestion(idSurveyQuestion: string){
    const questionCount =  this.inspectionQuestion.length;

        for(let index = 0; index < questionCount; index++){
            if(this.inspectionQuestion[index].idSurveyQuestion == idSurveyQuestion){
                return index;
            }
        }
    }

    NextQuestion() {
        this.choiceAnswer = '';
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.SwitchQuestion();
        this.slides.lockSwipes(true);
    }
    PreviousQuestion(){
        this.choiceAnswer = '';
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.SwitchQuestion();
        this.slides.lockSwipes(true);
    }

    saveAnswer(){
        if(this.CurrentQuestion.idSurveyQuestionChoice != null){
            this.controller.answerQuestion(this.idInspection, this.CurrentQuestion.idSurveyQuestion, this.choiceAnswer)
                .subscribe(result => {
                    this.inspectionQuestion = result;
                    this.CurrentQuestion = this.inspectionQuestion[this.selectedIndex];
                });
        }
    }

}
