import cors from "cors";

import express from "express";

import helmet from "helmet";

import morgan from "morgan";

import cookieParser from "cookie-parser";



import type MessageResponse from "./interfaces/message-response.js";



import api from "./api/index.js";

import auth from "./api/auth/auth.routes.js"

import * as middlewares from "./middlewares/index.js";



const app = express();



app.use(morgan("dev"));

app.use(helmet());



const corsOptions = {



    origin: 'http://localhost:5173', 

    



    credentials: true, 

    

  

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

    allowedHeaders: ['Content-Type', 'Authorization'],

};



app.use(cors(corsOptions));





app.use(express.json());

app.use(cookieParser());



app.use(middlewares.metricsMiddleware)



app.get<object, MessageResponse>("/", (req, res) => {

  res.json({

    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",

  });

});



app.use("/auth", auth)



app.use(middlewares.requireAuth);



app.use("/api/v1", api);



app.use(middlewares.notFound);

app.use(middlewares.errorHandler);



export default app;