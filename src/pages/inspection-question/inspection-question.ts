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
    public idInspection: string  = '';
    public selectedIndex = 0;
    public CurrentQuestion: InspectionQuestion = new InspectionQuestion();
    public nextQuestionAvailable = true;
    public previousQuestionAvailable = true;
    public QuestionTypeEnum = {'MultipleChoice': 1, 'TextAnswer':2, 'DateAnswer':3};
    public questionAnswer: string = '';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public controller: InspectionQuestionRepositoryProvider,
              )
  {
      this.idInspection = this.navParams.get('idInspection');
      this.loadInspectionQuestion();
  }

  ionViewDidLoad() {
      this.slides.lockSwipes(true);
  }

  loadInspectionQuestion()
  {
      this.controller.getList(this.idInspection)
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

    ChoiceChanged(){
    }


    NextQuestion() {
      this.saveAnswer();
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.SwitchQuestion();
        this.slides.lockSwipes(true);
    }
    PreviousQuestion(){
        this.saveAnswer();
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.SwitchQuestion();
        this.slides.lockSwipes(true);
        this.slides
    }

    saveAnswer(){
        this.validQuestionTypeAnswer();
        if (this.CurrentQuestion.answer != null) {
            this.controller.answerQuestion(this.CurrentQuestion)
                .debounceTime(500)
                .subscribe(result => {
                    this.CurrentQuestion = this.inspectionQuestion[this.selectedIndex];
                },
                    error => {console.log('Erreur lors de la sauvegarde de la réponse');});
        }
    }

    validQuestionTypeAnswer()
    {
        if(this.CurrentQuestion.questionType == this.QuestionTypeEnum.MultipleChoice){
            this.CurrentQuestion.answer = this.CurrentQuestion.idSurveyQuestionChoice;
        }
    }

}
