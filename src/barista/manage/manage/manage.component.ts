import { Component, OnInit } from '@angular/core';
import { LogoutAction } from "../../login/login.actions";
import { Dispatcher } from '../../../dispatcher/dispatcher';

@Component({
  selector: 'barista-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.sass']
})
export class ManageComponent implements OnInit {
  
  get isDesktop() {
    return document.documentElement.clientWidth >= 960;
  }
  
  constructor(protected dispatcher : Dispatcher) { }

  ngOnInit() {
  }
  
  logout() {
    this.dispatcher.dispatch(new LogoutAction());
  }

}
