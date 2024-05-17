"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_config_1 = require("./config/db.config");
const readings_routes_1 = __importDefault(require("./routes/readings.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.API_PORT || 4000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Server-side CORS setup for SSE
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET"],
    credentials: true
}));
app.use('/api/sensors/', readings_routes_1.default);
(0, db_config_1.dbConnection)()
    .then((conn) => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
})
    .catch((err) => {
    console.log(err);
});
