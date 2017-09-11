import { HierachicalRoleBaseAccessControl } from './hrbac';

export class Role {
  constructor(public roleId : string) {}
}

export class Resource {
  constructor(public resourceId : string) {}
}

export type AssertionFunction = (hrbac : HierachicalRoleBaseAccessControl, role : Role|null, resource? : Resource|null, privilege? : string|null) => boolean;

export class Assertion {
  constructor(public assert : AssertionFunction) {}
}
