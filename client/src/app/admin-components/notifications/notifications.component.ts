import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NotificationsService } from '../../services/notifications/notifications.service';
import { UserService } from '../../services/user/user.service';
import { EducationDetails } from '../../models/notifications';
import { User } from '../../models/user';
import { StudentService } from '../../services/student/student.service';
import { Student } from '../../models/student';
import { ExperienceDetails } from 'src/app/models/experience-details';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  educationdetails = new EducationDetails();
  user = new User();
  submitted = false;
  message: string;


  constructor(
    private router: Router,
    private educationservice: NotificationsService,
    private studentService : StudentService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
    // this.getEducationDetails();
  }

  userdata = new User();
  edudata = [];
  experiencedetails : ExperienceDetails;
  studentdata : Student;
  data = [];
  expdata = [];
  getUserDetails() {
    var uid = localStorage.getItem('currentUser');
    return this.userService.getUser(uid)
      .subscribe(userdata => {
          console.log("User Data : ", userdata.branch_id);
          this.userdata = userdata;
          this.studentService.getStudentProfiles(userdata.branch_id).subscribe(studentdata => {
            this.studentdata = studentdata
            console.log("Student Data : " , studentdata);
          });
          this.educationservice.getEducationDetails().subscribe(studentsedu => {
            console.log("Edu : " , studentsedu )
              studentsedu.forEach(studentedu => {
                this.studentService.getStudent(studentedu.roll_no).subscribe(edudata => {
                  if ( edudata.branch == userdata.branch_id ) {
                    this.edudata.push(studentsedu);
                  }
                })
              })
            })
            console.log("Education Details : " , this.edudata);        
          this.studentService.getStudentexperiences().subscribe(studexps => {
            console.log("Exp : " , studexps)
            studexps.forEach(studexp => {
              this.studentService.getStudent(studexp.roll_no).subscribe(expdata => {
                
                if ( expdata.branch == userdata.branch_id ) {
                  this.expdata.push(studexp);
                }
              })
            }) 
          }) 
          console.log("Experience Details : " , this.expdata);  
          console.log("Education Details : " , this.edudata)      
        } 
      ); 
  }

  approveRequest(data): void {
    this.submitted = true;
    console.log("Id of particular student : ", data);
    this.educationservice.approveRequest(data)
      .subscribe(result => this.message = "Job Post Updated Successfully!");
    // this.router.navigateByUrl('/notifications');
    // window.location.reload()
  }

  rejectRequest(data): void {
    this.submitted = true;
    console.log("Id of particular student : ", data);
    this.educationservice.rejectRequest(data)
      .subscribe(result => this.message = "Job Post Updated Successfully!");
    this.router.navigateByUrl('/notifications');
    window.location.reload()
  }

  approveProfileRequest(data): void {
    this.submitted = true;
    console.log("Id of particular student : ", data);
    this.educationservice.approveProfileRequest(data)
      .subscribe(result => this.message = "Job Post Updated Successfully!");
    this.router.navigateByUrl('/notifications');
    window.location.reload()
  }

  rejectProfileRequest(data): void {
    this.submitted = true;
    console.log("Id of particular student : ", data);
    this.educationservice.rejectProfileRequest(data)
      .subscribe(result => this.message = "Job Post Updated Successfully!");
    this.router.navigateByUrl('/notifications');
    window.location.reload() 
  }

  approveExperienceRequest(data): void {
    this.submitted = true;
    console.log("Id of particular student : ", data);
    this.educationservice.approveExperienceRequest(data)
      .subscribe(result => this.message = "Job Post Updated Successfully!");
    this.router.navigateByUrl('/notifications');
    window.location.reload()
  }

  rejectExperienceRequest(data): void {
    this.submitted = true;
    console.log("Id of particular student : ", data);
    this.educationservice.rejectExperienceRequest(data)
      .subscribe(result => this.message = "Job Post Updated Successfully!");
    this.router.navigateByUrl('/notifications');
    window.location.reload()
  }
  


}