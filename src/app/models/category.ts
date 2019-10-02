export class Category {
    
  id: number;
  category: string;
  age_group: string;

  constructor(id: number, cat: string, age: string) {
    this.id = id;
    this.category = cat;
    this.age_group = age;
  }
}