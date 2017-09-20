import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Dispatcher } from '../../../../dispatcher/dispatcher';
import { ReadProjectAction } from '../../projects/projects.actions';
import { ActivatedRoute } from '@angular/router';
import { ReadSuiteAction, ReadTestResultsAction, UpdateSuiteDialogAction } from '../suites.actions';
import { MdPaginator, MdTab } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'barista-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent implements OnInit, AfterViewInit {
  project : any;
  suite : any;
  
  projectId : string;
  suiteId : string;
  
  @ViewChild(MdPaginator) paginator : MdPaginator;
  activeTabIndex = 0;
  
  length = new BehaviorSubject<number>(0);
  results : Observable<any[]>;
  
  details : {
    label: string;
    result: any
  }[] = [];
  
  
  constructor(protected route : ActivatedRoute,
              protected dispatcher : Dispatcher) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('project');
      this.suiteId = params.get('suite');
      this.dispatcher.dispatch(new ReadProjectAction(this.projectId)).subscribe(project => {
        this.project = project;
      });
      this.loadSuite();
    });
    
    this.paginator.page.subscribe(() => {
      this.loadTestresults();
    })
  }
  
  ngAfterViewInit() : void {
    this.loadTestresults();
  }
  
  loadSuite() {
    this.dispatcher.dispatch(new ReadSuiteAction(this.projectId, this.suiteId)).subscribe(suite => {
      this.suite = suite;
    });
  }
  
  loadTestresults() {
    this.results = this.dispatcher.dispatch(new ReadTestResultsAction(this.projectId, this.suiteId, {
      descending: true,
      offset: this.paginator.pageIndex * this.paginator.pageSize,
      limit: this.paginator.pageSize
    })).map(result => {
      this.length.next(result.total);
      return result.rows;
    });
  }
  
  openUpdateDialog() {
    this.dispatcher.dispatch(new UpdateSuiteDialogAction(this.projectId, this.suite)).subscribe((result) => {
      console.log('suite update', result);
      if(result) {
        this.suite = result;
      }
    })
  }
  
  openDetails(result : any) {
    const label = result._id.substr(0, 6);
    let f = this.details.find(d => d.label === label);
    if(!f) {
      this.details.push({ label, result })
    }
    
    this.activeTabIndex = this.details.length + 1;
  }
  
  closeDetails(index : number) {
    this.details.splice(index, 1);
  }

}
