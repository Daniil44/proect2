import {login} from "../../auth/loginController.js";

export async function loginRoute(app){
    app.post("/auth/login", login)
}