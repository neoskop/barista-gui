import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { DispatcherService } from './dispatcher.service';
import { Router } from '@angular/router';
import { SetupAdministratorAction, SetupCheckAction } from "../setup/setup.actions";
import { AuthCheckAction, LoginAction, LogoutAction } from '../login/login.actions';
import { CreateProjectAction, UpdateProjectAction, RemoveProjectAction } from "../manage/projects/projects.actions";


@Injectable()
export class ApiService {
  protected cache = new Map<string, Promise<any>>();

  constructor(protected http : HttpClient,
              protected dispatcher : DispatcherService,
              protected router : Router) {
    this.setup();
  }
  
  setup() : void{
    this.dispatcher.for(SetupAdministratorAction).subscribe(async action => {
        const result = await this.http.post('/_api/setup', {
          username: action.username,
          email: action.email,
          password: action.password
        }).toPromise<{ success?: boolean, error?: string, token?: string }>();
  
      if(result.success) {
        localStorage.setItem('Authorization', result.token);
        this.clearCache('setupCheck');
        this.router.navigate([ '/' ]);
      }
    });
    
    this.dispatcher.for(SetupCheckAction).subscribe(async action => {
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
    })
    
    this.dispatcher.for(AuthCheckAction).subscribe(action => {
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
    });
    
    this.dispatcher.for(LoginAction).subscribe(async action => {
      try {
        const result = await this.http.post('/_api/login', {
          username: action.username,
          password: action.password
        }).toPromise<{ success? : boolean, error? : string, token? : string }>();
  
        if(result.success) {
          localStorage.setItem('Authorization', result.token);
          this.router.navigate([ '/' ]);
          action.next();
        } else {
          action.error(result.error);
        }
      } catch(e) {
        action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
      }
    })
    
    this.dispatcher.for(LogoutAction).subscribe(action => {
      localStorage.removeItem('Authorization');
      this.router.navigate([ '/login' ]);
      action.next();
    });
    
    this.dispatcher.for(CreateProjectAction).subscribe(async action => {
      try {
        await this.http.post('/_api/projects', action.project).toPromise();
        action.next(action.project);
      } catch(e) {
        action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
      }
    });
    
    this.dispatcher.for(UpdateProjectAction).subscribe(async action => {
      try {
        await this.http.put('/_api/projects', action.project).toPromise();
        action.next(action.project);
      } catch(e) {
        action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
      }
    });
    
    this.dispatcher.for(RemoveProjectAction).subscribe(async action => {
      try {
        await this.http.delete('/_api/projects/' + action.project._id).toPromise();
        action.next();
      } catch(e) {
        action.error(e.error && e.error.error || 'INTERNAL_SERVER_ERROR');
      }
    });
  }
  
  clearCache(key? : string) {
    if(key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

}
