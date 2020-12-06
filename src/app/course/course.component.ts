import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { combineLatest, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';
import { map, startWith, tap } from 'rxjs/operators';

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  data$: Observable<CourseData>;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get('courseId'), 10);
    const course$ = this.coursesService.loadCourseById(courseId).pipe(
      // tslint:disable-next-line: deprecation
      startWith(null)
    );
    const lessons$ = this.coursesService.loadAllCourseLessions(courseId).pipe(
      startWith([])
    );

    // CombineLatest returns data from each observable whenever it receives new value,
    // However, the first time calling combineLatest, it will have to wait until all observables to
    // emit value. Therefore, I am using startWith above to emit the default value
    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) => ({
        course,
        lessons,
      })),
      tap(console.log)
    );
  }
}











