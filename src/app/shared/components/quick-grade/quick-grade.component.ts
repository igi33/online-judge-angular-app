import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ComputerLanguageService } from 'src/app/core/services/computer-language.service';
import { GradeService } from 'src/app/core/services/grade.service';
import { ComputerLanguage } from '../../models/computer-language';
import { Grade } from '../../models/grade';
import { GradeSubmission } from '../../models/grade-submission';

@Component({
  selector: 'app-quick-grade',
  templateUrl: './quick-grade.component.html',
  styleUrls: ['./quick-grade.component.scss']
})
export class QuickGradeComponent implements OnInit {
  computerLanguages: ComputerLanguage[] = [];
  grade: Grade; // output grade
  quickGradeForm: FormGroup = new FormGroup({
    lang_id: new FormControl('', Validators.required),
    source_code: new FormControl('', Validators.required),
    time_limit: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(10000), Validators.pattern("^[0-9]*$")]),
    memory_limit: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(268435456), Validators.pattern("^[0-9]*$")]),
    input: new FormControl(''),
    expected_output: new FormControl(''),
  });
  processingForm = false;
  
  constructor(
    private langService: ComputerLanguageService,
    private gradeService: GradeService) { }

  ngOnInit(): void {
    this.loadLangs();
  }

  // convenience getter for easy access to form fields
  get f() { return this.quickGradeForm.controls; }

  loadLangs(): void {
    this.langService.getComputerLanguages().subscribe({
      next: data => {
        this.computerLanguages = data;
      }
    });
  }

  onKey(e): void {
    if (e.key == 'Tab') {
      e.preventDefault();

      let el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      el.value = el.value.substring(0, start) + "\t" + el.value.substring(end);
  
      // put caret at right position again
      el.selectionStart = el.selectionEnd = start + 1;
    }
  }

  submitCode(): void {
    this.processingForm = true;

    let gradeSubmission = new GradeSubmission({
      langId: this.quickGradeForm.get('lang_id').value,
      sourceCode: this.quickGradeForm.get('source_code').value,
      timeLimit: this.quickGradeForm.get('time_limit').value,
      memoryLimit: this.quickGradeForm.get('memory_limit').value,
      input: this.quickGradeForm.get('input').value,
      expectedOutput: this.quickGradeForm.get('expected_output').value,
    });
    this.gradeService.grade(gradeSubmission)
      .pipe(finalize(() => this.processingForm = false))
      .subscribe({
        next: data => {
          this.grade = data;
        }
    });
  }
  
  private getDate(date: string) {
    return new Date(date);
  }
}
