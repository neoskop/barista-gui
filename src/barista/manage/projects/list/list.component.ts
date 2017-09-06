import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/merge';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdPaginator, MdSort } from '@angular/material';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject } from 'rxjs/Subject';
import { DispatcherService } from "../../../services/dispatcher.service";
import { CreateProjectDialogAction, UpdateProjectDialogAction } from '../projects.actions';

@Component({
  selector: 'barista-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  displayColumns = [ 'id', 'name', 'url', 'branch', 'actions' ];
  dataSource : ProjectsDataSource | null = null;
  
  @ViewChild(MdSort) sort : MdSort;
  @ViewChild(MdPaginator) paginator : MdPaginator;
  
  filter = new FormControl();
  
  constructor(protected dispatcher : DispatcherService) { }

  ngOnInit() {
    this.dataSource = new ProjectsDataSource({ sort: this.sort, paginator: this.paginator });
    this.filter.valueChanges.debounceTime(150).distinctUntilChanged().subscribe(value => this.dataSource.filter = value);
  }

  openCreateDialog() {
    this.dispatcher.dispatch(new CreateProjectDialogAction()).subscribe((result) => {
      console.log('project create', result);
    })
  }
  
  openUpdateDialog(row : any) {
    this.dispatcher.dispatch(new UpdateProjectDialogAction(row)).subscribe((result) => {
      console.log('project update', result);
    })
  }
}

const DATA = [
  {
    "name": "Foobar Test",
    "repository": {
      "type": "git",
      "url": "asfaf",
      "branch": "master"
    },
    "security": {
      "read": "public",
      "exec": "restricted"
    },
    "auth": {
      "type": "ssh-key",
      "privateKey": "saafsaf\n",
      "publicKey": "iasd\n",
      "passphrase": ""
    },
    "suites": [],
    "_id": "foobar-test",
    "_rev": "1-0d0c3dba915145ceb1e829c3972d8ceb"
  },
  {
    "name": "Vaillant Heizung-Online",
    "repository": {
      "type": "git",
      "url": "git@bitbucket.org:neoskop/vaillant_heizsystem-salamander_app.git",
      "branch": "develop"
    },
    "auth": {
      "type": "ssh-key",
      "privateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAz/3grjgVj/o2OlNek4F9n5QVPoEafgGeafRuPjGT+qhr2QOR\n9wG4utSFebeaBHiYo+R3mVL1Z0BOz9sFobTiPkkKfKLqa5uJzfLsC4w1zIj/Yaeu\ncla3K+si1O/tFOXyW9tLGrmDVLTCVG0lrllxXelW543nvq0peisO9ZbrIZ3VN4UJ\nJmxCKoYJX7v8FTDsPlLWoGK9xAdtHJ3FXhP8C0KCISo/U7P2Js4qteXjDtRQBUmE\nZsH740WzuIUKjb/jnX3Pp6ho8Y8ZWwpfxZWXD+Vr9lZcPUbJZSlwTPWiWInbwnjv\n5B69eHy3u1L9Fcb1HOuwQF/tG9FmEbEXvQQAJwIDAQABAoIBAG9kXZ+Qw+OPMtm7\n6qv/LuN3MIWAKUsQ3OGMGjrO3Jzi9JeONO9gCaptxWpxrVf1qnIkGvWPm4SHyW3C\ntFptgLmw7p/ftMKa04vsLQTmO63mNTf80Q3FaWZpEQeP055cpJcTdD7E2hRUlrsW\nlZaxqmiMXpG2y0WwgcU/KEzZXeZrJSHrPcq4dqCKBsCyJvwSg4X2JpmAcpaeLbBM\njwJmHCUK4WKqvYRO/XIV+OgKul3goALMGIPr6Cjm/sftJnWh3sY0LtsXtzrlIe7k\nI/fnZGItTmRoXJpbvbzeFdIdmfqlXiOo6KOKZoE/Zh6wQEBmeCpC1Xcn+nhevxPX\nKhyEbukCgYEA6qAqxC0/oLtJ7YP03fiJ8v+GY0wYjXmjeAazOLfyibkMKL9y0uYO\nmThyOLXfMObnisRakSy5I8ZA4AbHo6rIr80evCfYvx+qLAtaQYiDJedxeI/dI310\ns9oJ/1tGupkdAP4QVY2wCKeWEY1MTF79SJufWOL+Nso+RzS6XyOhEnMCgYEA4vCQ\n3VLPvk2C73TuQBsjiaCFeqlzPnRSyS5+eEN0NCYfOaK+7WiwmrUyG+UOkBNZe7dH\niznxplfEo0W07IIH0lkqCUlAHzMUXb4oOUh6CB4xafXy5PRck0vUa8G/CcN4fVA8\nI3oZH0qWyclqLRpA3rO0ZQEE1mahQJ0oN1fkin0CgYB9n7iGRXv2AZG5vJeVagfi\ntfIspIfY6DIgh+XaDpOsLgpWnvtJ9KgIXfK6bpbMRjXfVPbxGDMg9nux969Y8I53\noqo8MFGbM8cXwhRXVlJyLxPQa6cJ45hi2/HSafra2jRvXZk9VZnVaHWvfCpIEewn\nvjt5ikB28Z6a3Z6UZi1OBQKBgQDVycD+7yOL6GNgB+zmcWqSHamBO564iEbxBZ7Y\n1triwcMKvdlVuBkfNXFmO+vzKHdVB/0bGNQgW3CAS4u8fma174+dPedtPOaDxT8J\nb9CeUytD4hIXRGjtzjLn7JZ2sTGSBAMTfNOr2c2hfOBMav4PjoVz3XjcLcTdJPAc\n6uz+1QKBgHpyQRNDmhcX2I+ZabUVGMZ40jPSVPTIABZ5yQpnn4FoCzobQh+4aRMy\nJAm9XrxSvQN9eZCvJ3yqnqhh2WCHex8+HrPD0Pxzm6IqDDf9DML84iLQAuPVfkX8\nLry5pJa/i8kBi4+9rYTv28xCjhuujskuCNRwJPIYxOfsEnFYbpAX\n-----END RSA PRIVATE KEY-----\n",
      "publicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDP/eCuOBWP+jY6U16TgX2flBU+gRp+AZ5p9G4+MZP6qGvZA5H3Abi61IV5t5oEeJij5HeZUvVnQE7P2wWhtOI+SQp8ouprm4nN8uwLjDXMiP9hp65yVrcr6yLU7+0U5fJb20sauYNUtMJUbSWuWXFd6Vbnjee+rSl6Kw71lushndU3hQkmbEIqhglfu/wVMOw+UtagYr3EB20cncVeE/wLQoIhKj9Ts/Ymziq15eMO1FAFSYRmwfvjRbO4hQqNv+Odfc+nqGjxjxlbCl/FlZcP5Wv2Vlw9RsllKXBM9aJYidvCeO/kHr14fLe7Uv0VxvUc67BAX+0b0WYRsRe9BAAn jenkins@Marks-MacBook-Pro.local\n",
      "passphrase": ""
    },
    "security": {
      "read": "public",
      "exec": "public"
    },
    "suites": [
      {
        "id": "de",
        "name": "Deutschland",
        "glob": [
          "e2e/de/**/*.spec.ts"
        ],
        "browsers": [
          "chrome",
          "firefox"
        ],
        "options": {
          "skipJsErrors": true,
          "quarantineMode": true,
          "selectorTimeout": 10000,
          "assertionTimeout": 3000,
          "speed": 0.75
        }
      },
      {
        "id": "be",
        "name": "Belgien",
        "glob": [
          "e2e/be/**/*.spec.ts"
        ],
        "browsers": [
          "chrome"
        ]
      }
    ],
    "_id": "vaillant-salamander",
    "_rev": "24-1d171d83ab855bb59b711c813c6c8324"
  }
]

export class ProjectsDataSource extends DataSource<any> {
  protected _filterSubject = new BehaviorSubject('');
  get filter() { return this._filterSubject.value }
  set filter(filter : string) { this._filterSubject.next(filter) }
  
  protected sort : MdSort | null = null;
  protected paginator : MdPaginator | null = null;
  
  
  constructor({ sort, paginator } : { sort? : MdSort, paginator? : MdPaginator } = {}) {
    super();
    
    if(sort) {
      this.sort = sort;
    }
    if(paginator) {
      this.paginator = paginator;
    }
  }
  
  connect(collectionViewer : CollectionViewer) : Observable<any[]> {
    const changes : Subject<any>[] = [
      this._filterSubject,
    ];
    
    if(this.sort) {
      changes.push(this.sort.mdSortChange);
    }
    if(this.paginator) {
      changes.push(this.paginator.page);
    }
    
    return Observable.merge(...changes).debounceTime(50).map(() => {
      const filter = this.filter.toLowerCase();
      const data = filter ? DATA.filter(row => {
        return row.name.toLowerCase().includes(filter)
          || row._id.toLowerCase().includes(filter)
          || row.repository.url.toLowerCase().includes(filter)
          || row.repository.branch.toLowerCase().includes(filter)
      }) : DATA.slice();
      

      if(this.sort) {
        const { active, direction } = this.sort;
  
        if(active) {
          data.sort((a, b) => {
            let aV : string, bV : string;
      
            switch(active) {
              case 'id':
                [ aV, bV ] = [ a._id, b._id ];
                break;
              case 'name':
                [ aV, bV ] = [ a.name, b.name ];
                break;
              case 'url':
                [ aV, bV ] = [ a.repository.url, b.repository.url ];
                break;
              case 'branch':
                [ aV, bV ] = [ a.repository.branch, b.repository.branch ];
                break;
            }
      
            return aV.localeCompare(bV) * ('desc' === direction ? -1 : 1);
          })
        }
      }
  
      if(this.paginator) {
        const start = this.paginator.pageIndex * this.paginator.pageSize;
        const end = this.paginator.pageIndex * this.paginator.pageSize + this.paginator.pageSize;
        return data.slice(start, end);
      }
      return data;
    })
  }
  
  disconnect(collectionViewer : CollectionViewer) : void {
  }
}
