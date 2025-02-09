// models/UsersObj.js

class UsersObj {
    constructor(name, email, password, userStat) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.userStat = userStat; 
    }

    toDatabaseFormat() {
        return {
            name: this.name,
            email: this.email,
            password: this.password,
            user_stat: this.userStat,
        };
    }
}

module.exports = UsersObj;