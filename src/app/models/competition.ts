export class Competition {

  id: number;
  competition_number: number;
  competition_name: string;
  age_group: number;
  comp_type: number;

  constructor(id:number, compNumber: number, name: string, age: number, type: number) {
    this.id = id;
    this.competition_number = compNumber;
    this.competition_name = name;
    this.age_group = age;
    this.comp_type = type;
  }
}