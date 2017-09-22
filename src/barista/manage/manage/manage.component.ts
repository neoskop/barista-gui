import { Component, OnInit } from '@angular/core';
import { LogoutAction } from "../../login/login.actions";
import { Dispatcher } from '../../../dispatcher/dispatcher';
import { UserService, IUser } from '../../services/user.service';
import { UpdatePasswordDialogAction } from '../profile/profile.actions';

@Component({
  selector: 'barista-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.sass']
})
export class ManageComponent implements OnInit {
  
  get isDesktop() {
    return document.documentElement.clientWidth >= 960;
  }
  
  get user() : IUser|null {
    return this.userService.getCurrentUser();
  }
  
  constructor(protected dispatcher : Dispatcher, public userService : UserService) { }

  ngOnInit() {
  }
  
  logout() {
    this.dispatcher.dispatch(new LogoutAction());
  }

  updatePassword() {
    this.dispatcher.dispatch(new UpdatePasswordDialogAction());
  }
}
