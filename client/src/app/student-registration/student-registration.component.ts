import { Component, OnInit } from '@angular/core';
import { Student } from '../models/student';
import { Branch } from '../models/branch';
import { StudentService } from '../services/student/student.service';
import {FormGroup, FormArray, FormBuilder} from '@angular/forms';
import { Location } from '@angular/common';
import { UtilsService } from '../services/utils/utils.service';
import { UploadFileService } from '../services/file/file.service';
import { MailFormat } from '../models/mail-format';

@Component({
  selector: 'app-student-registartion',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.css']
})

export class RegisterStudentComponent{
  student = new Student();
  submitted = false;
  myForm: FormGroup;
  branches: Branch[]
  selectedFiles: FileList;
  backlogs = ["Never had any backlog", "Cleared All", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "More than 10"];
  data = {
    education_details : [
      {
      roll_no: localStorage.getItem('currentUser'),
      certificate_degree_name: '',
      major: '',
      board: '',
      institute_university_name : '',
      passing_year: 2019,
      percentage: 100,
      cgpa: 10,
      proof_document: null    
      }
    ],
    experience_details : [ 
      {
      roll_no: localStorage.getItem('currentUser'),
      is_current_job: false,
      start_date: null,
      end_date: null,
      job_title: '',
      company_name: '',
      job_location_city:  '',
      description: '',
      proof_document: null
      }
    ]
  }
  constructor(
    private studentService: StudentService,
    private utilService: UtilsService,
    private uploadService: UploadFileService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.utilService.getBranches().subscribe(branch => {
      this.branches = branch;
    })
    this.myForm = this.fb.group({
      education_details: this.fb.array([]),
      experience_details: this.fb.array([])
    })
    // console.log(this.data)
    // const id = localStorage.getItem('currentUser');
    
    this.setEducationDetails();
    this.setExperienceDetails();
  }

  deleteEducationDetails(index) {
    let control = <FormArray>this.myForm.controls.education_details;
    control.removeAt(index)
  }

  newStudent(): void {
    this.submitted = false;
    this.student = new Student();
  }


 addStudent() {
   this.submitted = true;
   this.save();
 }

 setExperienceDetails() {
  let control = <FormArray>this.myForm.controls.experience_details;
  this.data.experience_details.forEach(x => {
    control.push(this.fb.group({ 
      roll_no: x.roll_no,
      is_current_job: x.is_current_job,
      start_date: x.start_date,
      end_date: x.end_date,
      job_title: x.job_title,
      company_name: x.company_name,
      job_location_city: x.job_location_city,
      description: x.description,
      proof_document: x.proof_document
     }))
  })
}

addNewExperienceForm() {
  let control = <FormArray>this.myForm.controls.experience_details;
  control.push(
    this.fb.group({
      roll_no: localStorage.getItem('currentUser'),
      is_current_job: false,
      start_date: null,
      end_date: null,
      job_title: '',
      company_name: '',
      job_location_city:  '',
      description: '',
      proof_document: null
    })
  )
}

deleteExperienceDetails(index) {
  let control = <FormArray>this.myForm.controls.experience_details;
  control.removeAt(index)
}

setEducationDetails() {
  let control = <FormArray>this.myForm.controls.education_details;
  this.data.education_details.forEach(x => {
    control.push(this.fb.group({ 
      roll_no: x.roll_no,
      certificate_degree_name: x.certificate_degree_name,
      major: x.major,
      board: x.board,
      institute_university_name : x.institute_university_name,
      passing_year : x.passing_year,
      percentage: x.percentage,
      cgpa: x.cgpa,
      proof_document: x.proof_document
     }))
  })
}

selectFile(event) {
  this.selectedFiles = event.target.files;
}

loadfiles() {
  for(var i = 0; i < this.myForm.value.education_details.length; i++){
    this.myForm.value.education_details[i].proof_document = this.selectedFiles.item(i);
  }
  for(; i < this.myForm.value.experience_details.length; i++){
    this.myForm.value.experience_details[i].proof_document = this.selectedFiles.item(i);
  }
}

addNewEducationForm() {
  let control = <FormArray>this.myForm.controls.education_details;
  control.push(
    this.fb.group({
      roll_no: localStorage.getItem('currentUser'),
      certificate_degree_name: '',
      major: '',
      board: '',
      institute_university_name : '',
      passing_year : 2019,
      percentage: 100,
      cgpa: 10,
      proof_document: null
    })
  )
}

  goBack(): void {
    this.location.back();
  }

  private save(): void {
    console.info("student info", this.student);
    this.student.roll_no = localStorage.getItem('currentUser');
    this.loadfiles()
    this.student.education_details = this.myForm.value.education_details;
    this.student.experience_details = this.myForm.value.experience_details;
    this.studentService.addStudentProfile(this.student)
    .subscribe();
    for(let i in this.student.education_details){
       this.studentService.addStudentEducationDetails(this.student.education_details[i]).subscribe(result => {
         console.log("E", result)
        this.uploadService.pushFileToStorage(result.toString(), this.student.education_details[i].proof_document).subscribe();
    
    })
  }
    for(let i in this.student.experience_details){
      this.studentService.addStudentExperienceDetails(this.student.experience_details[i]).subscribe(result => {
        console.log("E", result)
       this.uploadService.pushFileToStorage(result.toString(), this.student.experience_details[i].proof_document).subscribe();
      });
    }
    var mailFormat = new MailFormat();
    mailFormat.to = this.student.roll_no+'@bvrithyderabad.edu.in';
    mailFormat.subject = 'Placement Portal:Registrated Successfully.';
    mailFormat.text = 'You have successfully submitted the initial Registration Form. Your profile will be updated after the details are verified by your department placement co-ordinated. You will be notified soon. ';
    mailFormat.html =  'You have successfully submitted the initial Registration Form. Your profile will be updated after the details are verified by your department placement co-ordinated. You will be notified soon.';
   console.log(mailFormat)
    this.utilService.sendMail(mailFormat)
  }
}
