export class SlipComp {

  entryId: number;
  ageGroup: number;
  slipNumber: number;
  competitionName: string;

  constructor(entry: number, age: number, slipNo: number, name: string) {
    this.entryId = entry;
    this.ageGroup = age;
    this.slipNumber = slipNo;
    this.competitionName = name;
  }
}