export class County {
    id: number;
    county_name: string;
    fleadh_date: Date;

    constructor(id: number, name: string, date: Date) {
        this.id = id;
        this.county_name = name;
        this.fleadh_date = date;
    }
}