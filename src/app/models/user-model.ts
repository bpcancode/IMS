export class User {
    id: string;
    username: string;
    password: string;
    email: string;
    roleId: string;
    

    constructor(id: string, username: string, email: string, roleId: string, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roleId = roleId;
        this.password = password;
    }

    public updateUser(username: string, email: string, roleId: string, password: string) {
        this.username = username;
        this.email = email;
        this.roleId = roleId;
        this.password = password;
    }
}