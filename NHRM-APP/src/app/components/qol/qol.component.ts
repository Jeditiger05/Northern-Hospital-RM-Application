import { Component, OnInit } from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {Router} from '@angular/router';
import {Patient} from 'src/app/models/patient';
import {DataService} from 'src/app/services/data.service';

@Component({
  selector: 'app-qol',
  templateUrl: './qol.component.html',
  styleUrls: ['./qol.component.css']
})
export class QolComponent implements OnInit {


  public patient: Patient;

  model: any = {};
  
  // The survey categories and questions retrieved from the API
  survey: any = [{
      categoryName: "Mobility",
      questions: ["I have no problems in walking about", "I have slight problems in walking about", 
      "I have moderate problems in walking about", "I have severe problems in walking about", "I am unable to walk about"],
    },
    {
      categoryName: "Self Care",
      questions: ["I have no problems washing or dressing myself", "I have slight problems washing or dressing myself", 
      "I have moderate problems washing or dressing myself", "I have severe problem washing or dressing myself",
      "I am unable to wash or dress myself"],
    },
    {
      categoryName: "Usual Activites",
      questions: ["I have no problems doing my casual activities", "I have slight problems doing my casual activites",
    "I have moderate problems doing my usual activities", "I have severe problems doing my usual activites",
    "I am unable to do my usual activities"]
    },
    {
      categoryName: "Pain/Discomfort",
      questions: ["I have no pain or discomfort", "I have slight pain or discomfort", 
      "I have moderate pain or discomfort", "I have severe pain or discomfort", 
      "I have extreme pain or discomfort"]
    }
  ];

  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] 
  form = new FormGroup({});
  currentCategory: number;

  constructor(private router: Router, private dataService: DataService) {
    dataService.patient.subscribe(data => {this.patient = data});
  }

  displayQuestions() {
    this.fields = [ {
      key: this.survey[this.currentCategory].categoryName,
      type: 'radio',
      templateOptions: {
        options: [
            { value: 1, label: this.survey[this.currentCategory].questions[0] },
            { value: 2, label: this.survey[this.currentCategory].questions[1] },
            { value: 3, label: this.survey[this.currentCategory].questions[2] },
            { value: 4, label: this.survey[this.currentCategory].questions[3] },
            { value: 5, label: this.survey[this.currentCategory].questions[4] },
          ],
          required: true
        }
      }, 
    ];
  }

  ngOnInit(): void {
    this.currentCategory = 0;
    this.displayQuestions();
  }

  submit() {
    //alert(JSON.stringify(this.model));

    this.currentCategory += 1;
    this.displayQuestions();
  }

  infoDialog(){
    
  }

  submitSurvey() {

    let categories = Object.keys(this.form.value);
    
    for(let i = 0; i < categories.length; i++) {

      let patientMeasurement = {
        'hospitalNumber': this.patient.hospitalNumber,
        'categoryId': this.patient.categoryId,
        'dataPointNumber': i + 1,
        'measurementId': 6,
        'timeStamp': new Date(),
        'value': this.form.value[categories[i]]
      };

      this.dataService.postMeasurementResult(patientMeasurement)
      .then(() => this.router.navigate(['/qol-vas']))
      .catch((err) => console.log(err + "Quality of Life Error"));
    }

    //Submit the data 
    //this.router.navigateByUrl('/qol-vas');

  }

}
