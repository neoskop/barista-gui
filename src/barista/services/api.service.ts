import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Router } from '@angular/router';
import { SetupAdministratorAction, SetupCheckAction } from "../setup/setup.actions";
import { AuthCheckAction, LoginAction, LogoutAction } from '../login/login.actions';
import {
  CreateProjectAction, UpdateProjectAction, RemoveProjectAction, ReadProjectAction, SearchProjectAction
} from "../manage/projects/projects.actions";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { SearchSuiteAction, CreateSuiteAction, UpdateSuiteAction, RemoveSuiteAction, ReadSuiteAction } from "../manage/suites/suites.actions";
import { Dispatcher } from "../../dispatcher/dispatcher";
import { HierachicalRoleBaseAccessControl } from "../../hrbac/hrbac";
import * as jwt from 'jwt-decode';
import { RoleStore } from "../../hrbac/ng/role-store";


@Injectable()
export class ApiService {
  protected cache = new Map<string, Promise<any>>();

  constructor(protected http : HttpClient,
              protected dispatcher : Dispatcher,
              protected router : Router,
              protected hrbac : HierachicalRoleBaseAccessControl,
              protected roleStore : RoleStore) {
    
    dispatcher.for(SetupCheckAction).subscribe(a => this.setupCheck(a));
    dispatcher.for(AuthCheckAction).subscribe(a => this.authCheck(a));
  
    dispatcher.for(LoginAction).subscribe(a => this.login(a));
    dispatcher.for(LogoutAction).subscribe(a => this.logout(a));
    
    dispatcher.for(SetupAdministratorAction).subscribe(a => this.setupAdministrator(a));
    
    dispatcher.for(SearchProjectAction).subscribe(a => this.searchProject(a));
    dispatcher.for(CreateProjectAction).subscribe(a => this.createProject(a));
    dispatcher.for(UpdateProjectAction).subscribe(a => this.updateProject(a));
    dispatcher.for(RemoveProjectAction).subscribe(a => this.removeProject(a));
    dispatcher.for(ReadProjectAction).subscribe(a => this.readProject(a));
    
    dispatcher.for(SearchSuiteAction).subscribe(a => this.searchSuite(a));
    dispatcher.for(CreateSuiteAction).subscribe(a => this.createSuite(a));
    dispatcher.for(UpdateSuiteAction).subscribe(a => this.updateSuite(a));
    dispatcher.for(RemoveSuiteAction).subscribe(a => this.removeSuite(a));
    dispatcher.for(ReadSuiteAction).subscribe(a => this.readSuite(a));
  }
  
  async setupAdministrator(action : SetupAdministratorAction) {
    const result = await this.http.post('/_api/setup', {
      username: action.username,
      email: action.email,
      password: action.password
    }).toPromise<{ success?: boolean, error?: string, token?: string }>();
  
    if(result.success) {
      localStorage.setItem('Authorization', result.token);
      const token = jwt<{ aud: string, rol: string[] }>(result.token);
  
      this.hrbac.inherit(token.aud, ...token.rol);
      this.roleStore.setRole(token.aud);
      this.clearCache('setupCheck');
      this.router.navigate([ '/' ]);
    }
  }
  
  async setupCheck(action : SetupCheckAction) {
    let result : Promise<boolean>;
    if(this.cache.has('setupCheck')) {
      result = this.cache.get('setupCheck');
    } else {
      result = this.http.get('/_api/setup-check').map<{ message: string, result: boolean }, boolean>(res => res.result).toPromise();
    }
    const hasToSetup = !(await result);
  
    if(action.isSetup && !hasToSetup) {
      this.router.navigate([ '/' ]);
      return action.next(false);
    }
    if(!action.isSetup && hasToSetup) {
      this.router.navigate([ '/setup' ]);
      return action.next(false);
    }
  
    return action.next(true);
  }
  
  async authCheck(action : AuthCheckAction) {
    const hasToLogin = !localStorage.getItem('Authorization');
  
    if(action.isLogin && !hasToLogin) {
      this.router.navigate([ '/' ]);
      return action.next(false);
    }
    if(!action.isLogin && hasToLogin) {
      this.router.navigate([ '/login' ]);
      return action.next(false);
    }
  
    action.next(true);
  }
  
  async login(action : LoginAction) {
    try {
      const result = await this.http.post('/_api/login', {
        username: action.username,
        password: action.password
      }).toPromise<{ success? : boolean, error? : string, result? : string }>();
    
      if(result.success) {
        localStorage.setItem('Authorization', result.result);
        const token = jwt<{ aud: string, rol: string[] }>(result.result);
  
        this.hrbac.inherit(token.aud, ...token.rol);
        this.roleStore.setRole(token.aud);
        this.router.navigate([ '/' ]);
        action.next();
      } else {
        action.error(result.error);
      }
    } catch(e) {
      action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
    }
  }
  
  logout(action : LogoutAction) {
    localStorage.removeItem('Authorization');
    this.roleStore.setRole('guest');
    this.router.navigate([ '/login' ]);
    action.next();
  }
  
  async searchProject(action : SearchProjectAction) {
    let params = new HttpParams();
    if(action.params.filter) {
      params = params.set('filter', action.params.filter);
    }
    if(action.params.sort) {
      params = params.set('sort', action.params.sort);
    }
    if(action.params.order) {
      params = params.set('order', action.params.order);
    }
    if(action.params.offset) {
      params = params.set('offset', action.params.offset.toString());
    }
    if(action.params.limit) {
      params = params.set('limit', action.params.limit.toString());
    }
    this.http.get('/_api/projects/', { params })
      .catch(e => Observable.throw(e.error && e.error.error || 'INTERNAL_SERVER_ERROR'))
      .map<any, any>(result => result.result)
      .subscribe(action);
  }
  
  async createProject(action : CreateProjectAction) {
    try {
      await this.http.post('/_api/projects', action.project).toPromise();
      action.next(action.project);
    } catch(e) {
      action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
    }
  }
  
  async updateProject(action : UpdateProjectAction) {
    try {
      await this.http.put(`/_api/projects/${action.project._id}`, action.project).toPromise();
      action.next(action.project);
    } catch(e) {
      action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
    }
  }
  
  async removeProject(action : RemoveProjectAction) {
    try {
      await this.http.delete(`/_api/projects/${action.project._id}`).toPromise();
      action.next();
    } catch(e) {
      action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
    }
  }
  
  async readProject(action : ReadProjectAction) {
    let params = new HttpParams();
    if(action.fetch) {
      params = params.set('fetch', action.fetch);
    }
    this.http.get('/_api/projects/' + action.projectId, { params })
      .catch(e => Observable.throw(e.error && e.error.error || 'INTERNAL_SERVER_ERROR'))
      .map<any, any>(result => result.result)
      .subscribe(action);
  }
  
  searchSuite(action : SearchSuiteAction) {
    let params = new HttpParams();
    if(action.params.filter) {
      params = params.set('filter', action.params.filter);
    }
    if(action.params.sort) {
      params = params.set('sort', action.params.sort);
    }
    if(action.params.order) {
      params = params.set('order', action.params.order);
    }
    if(action.params.offset) {
      params = params.set('offset', action.params.offset.toString());
    }
    if(action.params.limit) {
      params = params.set('limit', action.params.limit.toString());
    }
    this.http.get(`/_api/projects/${action.projectId}/suites`, { params })
      .catch(e => Observable.throw(e.error && e.error.error || 'INTERNAL_SERVER_ERROR'))
      .map<any, any>(result => result.result)
      .subscribe(action);
  
  }
  
  async createSuite(action : CreateSuiteAction) {
    try {
      await this.http.post(`/_api/projects/${action.projectId}/suites`, action.suite).toPromise();
      action.next(action.suite);
    } catch(e) {
      action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
    }
  }
  
  async updateSuite(action : UpdateSuiteAction) {
    try {
      await this.http.put(`/_api/projects/${action.projectId}/suites/${action.suite.id}`, action.suite).toPromise();
      action.next(action.suite);
    } catch(e) {
      action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
    }
  }
  
  async removeSuite(action : RemoveSuiteAction) {
    try {
      await this.http.delete(`/_api/projects/${action.projectId}/suites/${action.suite.id}`).toPromise();
      action.next();
    } catch(e) {
      action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
    }
  }
  
  readSuite(action : ReadSuiteAction) {
    this.http.get(`/_api/projects/${action.projectId}/suites/${action.suiteId}`)
      .catch(e => Observable.throw(e.error && e.error.error || 'INTERNAL_SERVER_ERROR'))
      .map<any, any>(result => result.result)
      .subscribe(action);
  }
  
  clearCache(key? : string) {
    if(key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

}
