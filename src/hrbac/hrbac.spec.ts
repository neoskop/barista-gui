import { HierachicalRoleBaseAccessControl } from "./hrbac";
import { Resource, Role } from "./types";
import { RoleManager } from "./role-manager";
import { PermissionManager } from './permission-manager';

class DocumentResource extends Resource {
  constructor(public author : string) {
    super('document')
  }
}

class UserRole extends Role {
  constructor(public id : string, role : string) {
    super(role);
  }
}

describe('HierachicalRoleBaseAccessControl', () => {
  let hrbac : HierachicalRoleBaseAccessControl;
  const authorA = new UserRole('a', 'author');
  const authorB = new UserRole('b', 'author');
  const editor = new UserRole('c', 'editor');
  const admin = new UserRole('z', 'admin');
  const user = new UserRole('u', 'user');
  
  const documentA = new DocumentResource('a');
  beforeEach(() => {
    hrbac = new HierachicalRoleBaseAccessControl(new RoleManager(), new PermissionManager());
    hrbac.inherit('user', 'guest');
    hrbac.inherit('author', 'user');
    hrbac.inherit('author', 'creator');
    hrbac.inherit('editor', 'user', 'manager');
    
    hrbac.deny();
    
    hrbac.allow('admin');
    
    hrbac.allow('guest', 'document', 'read');
    hrbac.allow('guest', 'document-comment', [ 'read', 'create' ]);
    
    hrbac.allow('user', 'document', [ 'list' ]);
    
    hrbac.allow('author', 'document', 'create');
    hrbac.allow('author', 'document', 'update', (rba : HierachicalRoleBaseAccessControl, role : UserRole, resource : DocumentResource) => {
      return role.id === resource.author;
    });
    
    hrbac.allow('editor', 'document', 'update');
    
    hrbac.deny('banned');
  });
  
  describe('role inheritance', () => {
    it('should save roles', () => {
      
      expect(Array.from(hrbac.roleManager.getParentRolesOf(user))).toEqual([ 'guest' ]);
      expect(Array.from(hrbac.roleManager.getParentRolesOf(editor))).toEqual([ 'user', 'manager' ]);
    });
  
    it('should return parents', () => {
      expect(hrbac.roleManager.getRecursiveParentRolesOf(editor)).toEqual([ 'editor', 'user', 'manager', 'guest' ]);
    });
  });
  
  describe('permissions', () => {
    it('guest', () => {
      expect(hrbac.isAllowed('guest', documentA, 'read')).toBeTruthy();
      expect(hrbac.isDenied('guest', documentA, 'read')).toBeFalsy();
      expect(hrbac.isAllowed('guest', documentA, 'update')).toBeFalsy();
      expect(hrbac.isDenied('guest', documentA, 'update')).toBeTruthy();
    });
    
    it('admin', () => {
      expect(hrbac.isAllowed(admin, 'settings')).toBeTruthy();
      expect(hrbac.isDenied(admin, 'settings')).toBeFalsy();
    });
    
    it('user', () => {
      expect(hrbac.isAllowed(user, documentA, 'read')).toBeTruthy();
      expect(hrbac.isDenied(user, documentA, 'read')).toBeFalsy();
      expect(hrbac.isAllowed(user, documentA, 'list')).toBeTruthy();
      expect(hrbac.isDenied(user, documentA, 'list')).toBeFalsy();
      expect(hrbac.isAllowed(user, documentA, 'update')).toBeFalsy();
      expect(hrbac.isDenied(user, documentA, 'update')).toBeTruthy();
    });
    
    it('editor', () => {
      expect(hrbac.isAllowed(editor, documentA, 'read')).toBeTruthy();
      expect(hrbac.isDenied(editor, documentA, 'read')).toBeFalsy();
      expect(hrbac.isAllowed(editor, documentA, 'list')).toBeTruthy();
      expect(hrbac.isDenied(editor, documentA, 'list')).toBeFalsy();
      expect(hrbac.isAllowed(editor, documentA, 'update')).toBeTruthy();
      expect(hrbac.isDenied(editor, documentA, 'update')).toBeFalsy();
      expect(hrbac.isAllowed(editor, documentA, 'create')).toBeFalsy();
      expect(hrbac.isDenied(editor, documentA, 'create')).toBeTruthy();
      expect(hrbac.isAllowed(editor, documentA, 'remove')).toBeFalsy();
      expect(hrbac.isDenied(editor, documentA, 'remove')).toBeTruthy();
    });
    
    it('author', () => {
      expect(hrbac.isAllowed(authorA, documentA, 'read')).toBeTruthy();
      expect(hrbac.isAllowed(authorA, documentA, 'list')).toBeTruthy();
      expect(hrbac.isAllowed(authorA, documentA, 'update')).toBeTruthy();
      expect(hrbac.isAllowed(authorA, documentA, 'create')).toBeTruthy();
      expect(hrbac.isAllowed(authorA, documentA, 'remove')).toBeFalsy();

      expect(hrbac.isAllowed(authorB, documentA, 'read')).toBeTruthy();
      expect(hrbac.isAllowed(authorB, documentA, 'list')).toBeTruthy();
      expect(hrbac.isAllowed(authorB, documentA, 'update')).toBeFalsy();
      expect(hrbac.isAllowed(authorB, documentA, 'create')).toBeTruthy();
      expect(hrbac.isAllowed(authorB, documentA, 'remove')).toBeFalsy();
    });
  })
});
