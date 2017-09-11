import { Component } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HrbacModule } from './hrbac.module';
import { HierachicalRoleBaseAccessControl } from '../hrbac';
import { RoleStore } from "./role-store";

@Component({
  template: `
    <div class="allowed-for-current-user">
      <span *ngIf="'index' | neoAllowed"></span>
    </div>
    <div class="denied-for-current-user">
      <span *ngIf="'admin-center' | neoAllowed"></span>
    </div>
    <div class="allowed-for-current-user-with-privilege">
      <span *ngIf="'comment' | neoAllowed:'read'"></span>
    </div>
    <div class="denied-for-current-user-with-privilege">
      <span *ngIf="'comment' | neoAllowed:'delete'"></span>
    </div>
    <div class="allowed-for-given-user">
      <span *ngIf="'profil' | neoAllowed:null:'user'"></span>
    </div>
    <div class="denied-for-given-user">
      <span *ngIf="'admin-center' | neoAllowed:null:'user'"></span>
    </div>
    <div class="allowed-for-given-user-with-privilege">
      <span *ngIf="'comment' | neoAllowed:'update':'user'"></span>
    </div>
    <div class="denied-for-given-user-with-privilege">
      <span *ngIf="'comment' | neoAllowed:'delete':'user'"></span>
    </div>
  `
})
class AllowedTestComponent {}


describe('AllowedPipe', () => {
  let component: AllowedTestComponent;
  let fixture: ComponentFixture<typeof component>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ HrbacModule ],
        declarations: [ AllowedTestComponent ]
      });
    
    const hrbac = TestBed.get(HierachicalRoleBaseAccessControl);
    
    hrbac.allow('guest', 'index');
    hrbac.allow('guest', 'comment', [ 'read', 'create' ]);
    
    hrbac.allow('user', 'profil');
    hrbac.allow('user', 'comment', [ 'read', 'create', 'update' ]);
    
    hrbac.allow('admin');
    
    fixture = TestBed.createComponent(AllowedTestComponent);
    component = fixture.componentInstance;
  }));
  
  it('should display if allowed', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.allowed-for-current-user > *').length).toBe(1);
  });
  
  it('should hide if allowed', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-current-user > *').length).toBe(0);
  });
  
  it('should display if allowed with privilege', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.allowed-for-current-user-with-privilege > *').length).toBe(1);
  });
  
  it('should hide if allowed with privilege', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-current-user-with-privilege > *').length).toBe(0);
  });
  
  it('should display if allowed with role', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.allowed-for-given-user > *').length).toBe(1);
  });
  
  it('should hide if allowed with role', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-given-user > *').length).toBe(0);
  });
  
  it('should display if allowed with role and privilege', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.allowed-for-given-user-with-privilege > *').length).toBe(1);
  });
  
  it('should hide if allowed with role and privilege', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-given-user-with-privilege > *').length).toBe(0);
  });
  
  it('should update after roleUpdate on RoleStore', inject([ RoleStore ], (roleStore : RoleStore) => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-current-user > *').length).toBe(0);
    
    roleStore.setRole('admin');
    fixture.detectChanges();
  
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-current-user > *').length).toBe(1);
  }));
});


@Component({
  template: `
    <div class="allowed-for-current-user">
      <span *ngIf="'index' | neoDenied"></span>
    </div>
    <div class="denied-for-current-user">
      <span *ngIf="'admin-center' | neoDenied"></span>
    </div>
    <div class="allowed-for-current-user-with-privilege">
      <span *ngIf="'comment' | neoDenied:'read'"></span>
    </div>
    <div class="denied-for-current-user-with-privilege">
      <span *ngIf="'comment' | neoDenied:'delete'"></span>
    </div>
    <div class="allowed-for-given-user">
      <span *ngIf="'profil' | neoDenied:null:'user'"></span>
    </div>
    <div class="denied-for-given-user">
      <span *ngIf="'admin-center' | neoDenied:null:'user'"></span>
    </div>
    <div class="allowed-for-given-user-with-privilege">
      <span *ngIf="'comment' | neoDenied:'update':'user'"></span>
    </div>
    <div class="denied-for-given-user-with-privilege">
      <span *ngIf="'comment' | neoDenied:'delete':'user'"></span>
    </div>
  `
})
class DeniedTestComponent {}

describe('DeniedDirective', () => {
  let component: DeniedTestComponent;
  let fixture: ComponentFixture<typeof component>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ HrbacModule ],
        declarations: [ DeniedTestComponent ]
      });
    
    const hrbac = TestBed.get(HierachicalRoleBaseAccessControl);
    
    hrbac.allow('guest', 'index');
    hrbac.allow('guest', 'comment', [ 'read', 'create' ]);
    
    hrbac.allow('user', 'profil');
    hrbac.allow('user', 'comment', [ 'read', 'create', 'update' ]);
    
    hrbac.allow('admin');
    
    fixture = TestBed.createComponent(DeniedTestComponent);
    component = fixture.componentInstance;
  }));
  
  it('should hide if allowed', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.allowed-for-current-user > *').length).toBe(0);
  });
  
  it('should display if allowed', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-current-user > *').length).toBe(1);
  });
  
  it('should hide if allowed with privilege', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.allowed-for-current-user-with-privilege > *').length).toBe(0);
  });
  
  it('should display if allowed with privilege', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-current-user-with-privilege > *').length).toBe(1);
  });
  
  it('should hide if allowed with role', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.allowed-for-given-user > *').length).toBe(0);
  });
  
  it('should display if allowed with role', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-given-user > *').length).toBe(1);
  });
  
  it('should hide if allowed with role and privilege', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.allowed-for-given-user-with-privilege > *').length).toBe(0);
  });
  
  it('should display if allowed with role and privilege', () => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-given-user-with-privilege > *').length).toBe(1);
  });
  
  it('should update after roleUpdate on RoleStore', inject([ RoleStore ], (roleStore : RoleStore) => {
    fixture.detectChanges();
    
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-current-user > *').length).toBe(1);
    
    roleStore.setRole('admin');
    fixture.detectChanges();
    fixture.whenStable();
  
    expect(fixture.debugElement.nativeElement.querySelectorAll('.denied-for-current-user > *').length).toBe(0);
  }));
});
