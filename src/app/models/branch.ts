export class Branch {
    id: number;
    branch_name: string;
    county: number;

    constructor(id: number, name: string, county: number) {
        this.id = id;
        this.branch_name = name;
        this.county = county;
    }
}