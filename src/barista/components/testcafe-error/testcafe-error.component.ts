import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as HighlightJs from 'highlight.js/lib/highlight';
import * as LangJs from 'highlight.js/lib/languages/javascript';
import * as LangTs from 'highlight.js/lib/languages/typescript';

HighlightJs.registerLanguage('javascript', LangJs);
HighlightJs.registerLanguage('typescript', LangTs);

const ASSERTION_ERROR_WITH_CODE_REGEX = /^(\w+): ([\s\S]+)\n\nBrowser: ([\s\S]+)\n\n([\s\S]+)\n\n([\s\S]+)$/mi;
const FIRST_CODE_LINE = /^ +(\d+) \|/;
const ERROR_CODE_LINE = /^ +> +(\d+) \|/m;
const REMOVE_CODE_LINE = /^[ >]+\d+ \|/gm;

@Component({
  selector: 'barista-testcafe-error',
  templateUrl: './testcafe-error.component.html',
  styleUrls: ['../../../../node_modules/highlight.js/styles/monokai.css', './testcafe-error.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class TestcafeErrorComponent implements OnInit {
  @Input('error')
  set _error(error : string) {
    this.errorAsText = null;
    this.error = null;
    
    let result : RegExpExecArray;
    if((result = ASSERTION_ERROR_WITH_CODE_REGEX.exec(error)) !== null) {
      const type = result![1];
      const message = result![2];
      const browser = result![3];
      const code = result![4];
      const stacktrace = result![5];
      
      const startLineResult = FIRST_CODE_LINE.exec(code);
      const errorLineResult = ERROR_CODE_LINE.exec(code);
      
      const codeText = code.replace(REMOVE_CODE_LINE, '');
      
      const r = HighlightJs.highlightAuto(codeText, [ 'javascript', 'typescript' ]);
      
      const html = this.sanitizer.bypassSecurityTrustHtml(r.value);
  
  
      const startLine = +startLineResult![1];
      const errorLine = +errorLineResult![1];
      
      const lines = Array.from(new Array(codeText.split(/\n/).length), (v, i) => ({ number: i + startLine, error: i + startLine === errorLine }));
      
      this.error = {
        type,
        message,
        browser,
        stacktrace,
        code: {
          startLine,
          errorLine,
          lines,
          html
        }
      };
      
      return;
    }
    
    this.errorAsText = error;
  }
  
  errorAsText : string|null = null;
  
  error : {
    type: string;
    message: string;
    browser: string;
    stacktrace: string;
    code : {
      startLine: number;
      errorLine: number;
      lines: { number: number, error: boolean }[];
      html : SafeHtml;
    }
  }|null = null;
  
  
  constructor(protected sanitizer : DomSanitizer) { }

  ngOnInit() {
  }
}
