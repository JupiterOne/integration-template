// Providers often supply types with their API libraries.

export interface AcmeUser {
  id: string;
  name: string;
}

export interface AcmeGroup {
  id: string;
  name: string;
  users?: Pick<AcmeUser, 'id'>[];
}
