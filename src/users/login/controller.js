var jwt  = require('jsonwebtoken');

class Users {
    constructor(data) {
        this.data = data;
    }
    configure(app) {
        const data = this.data;
        app.post("/api/users/login", async function(request, response) {
            let username = request.body.username;
            let password = request.body.password;

            if(username && password) {
                const users = await data.getUsersAsync();
                
                const res = users.reduce((accumulator, current) => {
                    if(current.username === username && current.password === password) {
                        accumulator = true;
                        return accumulator;
                    } else {
                        return accumulator;
                    }
                }, false);

                if (res) {
                    var token = jwt.sign({ username: username }, 'your_secret_key', { expiresIn: '1h' });
                    response.status(200).json(token);
                    return;
                };
            }
        })
    }
}

module.exports = Users;