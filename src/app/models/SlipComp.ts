export class SlipComp {

  entryId: number;
  entryRunningOrder: number;
  ageGroup: number;
  slipNumber: number;
  competitionName: string;

  constructor(entry: number, rOrder: number, age: number, slipNo: number, name: string) {
    this.entryId = entry;
    this.entryRunningOrder = rOrder;
    this.ageGroup = age;
    this.slipNumber = slipNo;
    this.competitionName = name;
  }
}