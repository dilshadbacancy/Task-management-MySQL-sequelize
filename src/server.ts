

import express, { Application } from "express";
import { config } from "./config/config";
import { SequelizeConnection } from "./config/databse";
import User from "./models/user.modle";
import userRoute from './route/user.route'
import todoRoute from "./route/todo.route";
import "./models/associations"; // 👈 this is CRUCIAL


const app: Application = express();

app.use(express.json());


app.use('/api/users', userRoute)
app.use('/api/todos', todoRoute)
const PORT = config.server.port;
const sequelize = SequelizeConnection.getInstance();


// app.all("*", (req, res) => {
//     return ApiResponse.error(res, `Route not found: ${req.originalUrl}`, null, 404);
// });




app.listen(PORT, () => {
    sequelize.sync({ force: false }).then((value) => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log("failed to connect databse::::" + `${err}`);
    });
    console.log(`Server running on the http://localhost:${PORT}`);
})

// app.use(globalErrorHandler as express.ErrorRequestHandler);

