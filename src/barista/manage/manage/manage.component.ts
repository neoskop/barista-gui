import { Component, OnInit, Renderer2 } from '@angular/core';
import { DispatcherService } from '../../services/dispatcher.service';
import { LogoutAction } from "../../login/login.actions";

@Component({
  selector: 'barista-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.sass']
})
export class ManageComponent implements OnInit {
  
  get isDesktop() {
    return document.documentElement.clientWidth >= 960;
  }
  
  constructor(protected dispatcher : DispatcherService) { }

  ngOnInit() {
  }
  
  logout() {
    this.dispatcher.dispatch(new LogoutAction());
  }

}
