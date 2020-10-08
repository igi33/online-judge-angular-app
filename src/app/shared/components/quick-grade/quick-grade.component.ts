import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
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
    time_limit: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]*$")]),
    memory_limit: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]*$")]),
    input: new FormControl(''),
    expected_output: new FormControl(''),
  });
  
  constructor(
    private langService: ComputerLanguageService,
    private gradeService: GradeService) { }

  ngOnInit(): void {
    this.loadLangs();
  }

  loadLangs(): void {
    this.langService.getComputerLanguages().pipe(first()).subscribe(resp => {
      this.computerLanguages = resp;
    });
  }

  onKey(e) {
    if (e.key == 'Tab') {
      e.preventDefault();

      let el = e.target;

      var start = el.selectionStart;
      var end = el.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      el.value = el.value.substring(0, start) + "\t" + el.value.substring(end);
  
      // put caret at right position again
      el.selectionStart = el.selectionEnd = start + 1;
    }
  }

  onSubmit(): void {
    let gradeSubmission = new GradeSubmission({
      langId: this.quickGradeForm.get('lang_id').value,
      sourceCode: this.quickGradeForm.get('source_code').value,
      timeLimit: this.quickGradeForm.get('time_limit').value,
      memoryLimit: this.quickGradeForm.get('memory_limit').value,
      input: this.quickGradeForm.get('input').value,
      expectedOutput: this.quickGradeForm.get('expected_output').value,
    });
    this.gradeService.grade(gradeSubmission).pipe(first()).subscribe(
      resp => {
        this.grade = resp;
      });
  }
}
