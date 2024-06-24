class Users {
    constructor(data) {
        this.data = data;
    }

    configure(app) {
        const data = this.data;
        app.post("/api/login", async function(request, response) {
            let user = request.body;
            const success = await data.loginAsync(user);
            if (success) {
                response.status(200).json();
            } else {
                response.status(401).json({
                    message: "login.failed"
                });
            }
        });
    }
}