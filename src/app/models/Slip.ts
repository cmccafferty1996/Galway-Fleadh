export class Slip {

  id: number;
  slipType: number;
  entryId: number;
  submittedBy: string;
  teleNo: string;
  email: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  entrantNames: string;
  entrantIds: number[];
  createTime: Date;

  constructor(stype: number, entry: number, name: string, phone: string, email: string,
    ad1: string, ad2: string, ad3: string, ad4: string, id?: number, entrant?: string, ids?: number[], create?: Date) {
      this.slipType = stype;
      this.entryId = entry;
      this.submittedBy = name;
      this.teleNo = phone;
      this.email = email;
      this.address1 = ad1;
      this.address2 = ad2;
      this.address3 = ad3;
      this.address4 = ad4;
      if (id) this.id = id;
      if (entrant) this.entrantNames = entrant;
      if (ids) this.entrantIds = ids;
      if (create) this.createTime = create;
  }
}