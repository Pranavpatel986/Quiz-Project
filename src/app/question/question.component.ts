import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public questionList:any=[];
  public currentQuestion:number=0;
  public points:number=0;
  counter=60;
  public name:string="";
  correctAnswer:number=0;
  incorrectAnswer:number=0;
  interval$:any;
  progress:string="0";
  isQuizCompleted :boolean=false;
  attempt:number=0;

  constructor(private questionService:QuestionService) { }

  ngOnInit(): void {
    this.name=localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      this.questionList=res.questions;
    })
  }
  nextQuestion(){
    this.currentQuestion++;
  }
  previousQuestion(){
    this.currentQuestion--;
  }
  answer(questionNo:number,option:any){
    if(option.correct){
      this.attempt++;
      this.getProgressPercent();
      this.points += 10;
      this.correctAnswer++;
      if(questionNo==this.questionList.length){
        setTimeout(()=>{
          this.isQuizCompleted=true;
          this.stopCounter();
      }, 1000);
      }
      setTimeout(()=>{
        if(this.currentQuestion < this.questionList.length-1){
          this.currentQuestion++;
          this.resetCounter();
        }
      }, 1000);
      
    }else if(!option.correct){
      this.attempt++;
      this.points -= 5
      this.incorrectAnswer++;
      this.getProgressPercent();
      if(questionNo==this.questionList.length){
        setTimeout(()=>{
          this.isQuizCompleted=true;
          this.stopCounter();
      }, 1000);
      }

      setTimeout(()=>{
        if(this.currentQuestion < this.questionList.length-1){
          this.currentQuestion++;
          this.resetCounter();
        }
      }, 1000);
    }
  } 
  startCounter(){
    this.interval$=interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=60;
        this.points-=5;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();
    }, 600000);
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
    this.progress="0";
  }
  getProgressPercent(){
    this.progress=(((this.currentQuestion+1)/this.questionList.length)*100).toString();
    return this.progress;
  }
}
