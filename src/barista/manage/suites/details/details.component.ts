import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Dispatcher } from '../../../../dispatcher/dispatcher';
import { ReadProjectAction } from '../../projects/projects.actions';
import { ActivatedRoute } from '@angular/router';
import { ReadSuiteAction, ReadTestResultsAction, RunTestAction, UpdateSuiteDialogAction } from '../suites.actions';
import { MdPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector   : 'barista-details',
  templateUrl: './details.component.html',
  styleUrls  : [ './details.component.sass' ]
})
export class DetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  project : any;
  suite : any;
  
  projectId : string;
  suiteId : string;
  
  @ViewChild(MdPaginator) paginator : MdPaginator;
  activeTabIndex = 0;
  
  length = 0;
  results : any[];
  
  details : {
    label : string;
    result : any
  }[] = [];
  
  protected ws : WebSocket;
  protected wsMessage : Observable<{ e : string, a : any[] }>;
  protected wsOut = new ReplaySubject<any>();
  
  constructor(protected route : ActivatedRoute,
              protected dispatcher : Dispatcher) {
  }
  
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
    });
  
    this.ws = new WebSocket(`ws://${location.host}/events/testresults`);
    this.wsMessage = Observable.create((obs : Observer<any>) => {
      this.ws.addEventListener('message', ({ data }) => {
        try {
          if(/^[A-Z_]+$/.test(data.toString())) {
            obs.error(data.toString());
          } else {
            obs.next(JSON.parse(data));
          }
        } catch(e) {
          obs.error(e)
        }
      });
    
      this.ws.addEventListener('error', error => {
        obs.error(error);
      });
    
      this.ws.addEventListener('close', () => {
        obs.complete();
      });
    
      return () => {
        this.ws.close();
      }
    });
  
    this.ws.addEventListener('open', () => {
      this.wsOut.subscribe(message => {
        this.ws.send(JSON.stringify(message));
      });
    });
  
    this.wsMessage.subscribe(message => {
      if(message.e === 'update') {
        for(const result of message.a) {
          if(this.results) {
            const resultIndex = this.results.findIndex(r => r.id === result.id);
            console.log({ resultIndex });
            if(-1 < resultIndex) {
              this.results[resultIndex] = result;
            }
          }
          const detailIndex = this.details.findIndex(d => d.result.id === result.id);
          console.log({ detailIndex });
          if(-1 < detailIndex) {
            this.details[detailIndex].result = result;
          }
        }
      }
      
      console.log('WS Message', message);
    }, error => {
      console.error('WS Error', error);
    });
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
    if(this.results) {
      const a = this.results.filter(r => r.status === 'scheduled' || r.status === 'running').map(r => r.id);
      this.wsOut.next({ m: 'off', a });
    }
    
    this.dispatcher.dispatch(new ReadTestResultsAction(this.projectId, this.suiteId, {
      descending: true,
      offset    : this.paginator.pageIndex * this.paginator.pageSize,
      limit     : this.paginator.pageSize
    })).subscribe(result => {
      this.length = result.total;
      this.results = result.rows;
      const a = this.results.filter(r => r.status === 'scheduled' || r.status === 'running').map(r => r.id);
      this.wsOut.next({ m: 'on', a });
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
  
  runTest() {
    this.dispatcher.dispatch(new RunTestAction(this.projectId, this.suiteId)).subscribe(result => {
      this.openDetails(result);
      this.loadTestresults();
    })
  }
  
  openDetails(result : any) {
    const label = result.id.substr(0, 6);
    let index = this.details.findIndex(d => d.result.id === result.id);
    if(-1 === index) {
      this.details.push({ label, result });
      this.activeTabIndex = this.details.length + 1;
      if(result.status === 'scheduled' || result.status === 'running') {
        this.wsOut.next({ m: 'on', a: [ result.id ] });
      }
    } else {
      this.details[ index ].result = result;
      this.activeTabIndex = 2 + index;
    }
  }
  
  closeDetails(index : number) {
    this.wsOut.next({ m: 'on', a: [ this.details[index].result.id ] });
    this.details.splice(index, 1);
  }
  
  ngOnDestroy() : void {
    this.ws.close();
  }
}
