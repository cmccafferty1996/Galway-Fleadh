export class Entrant {

    id: number;
    entrant_name: string;
    branch: number;
    dob: Date;
    isGroup: boolean;

    constructor(id: number, name: string, branch: number, birth: Date, group: boolean) {
        this.id = id;
        this.entrant_name = name;
        this.branch = branch;
        this.dob = birth;
        this.isGroup = group;
    }
}