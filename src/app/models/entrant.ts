export class Entrant {

    id: number;
    entrant_name: string;
    branch: number;
    dob: Date;

    constructor(id: number, name: string, branch: number, birth: Date) {
        this.id = id;
        this.entrant_name = name;
        this.branch = branch;
        this.dob = birth;
    }
}