import { Component, OnInit , Input} from '@angular/core';
import { Student } from '../models/student';
import { StudentService } from '../services/student/student.service';
import { UploadFileService } from '../services/file/file.service';
import { Achievement } from '../models/achievement';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent  implements OnInit {

  student: Student;
  data = [];
  img_id = 'student'
  @Input() fileUpload: string;

  constructor(private studentService: StudentService,
    private uploadService: UploadFileService) {}

  ngOnInit(): void {
    this.getStudentDetails();
  }

  getStudentDetails() {
    const id = localStorage.getItem('currentUser');
    this.uploadService.getFileById(id).subscribe(result =>{
      if(result){
        this.img_id = id;
    }
  });
    console.log(this.studentService.getVerifiedStudent(id)
    .subscribe(student => {
      this.student = student
      this.studentService.getVerifiedStudentEducationalDetails(id)
      .subscribe(educationDetails => 
        this.student.education_details = educationDetails)
      this.studentService.getVerifiedStudentExperienceDetails(id)
        .subscribe(experienceDetails => {
          this.student.experience_details = experienceDetails
          console.log(experienceDetails)
        })
        this.studentService.getAchievements(id)
        .subscribe(achievement => {
          this.student.achievements = achievement
        })
      this.data.push(student);
    }))
  
    return this.student;
 }
}
