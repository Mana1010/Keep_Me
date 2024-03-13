"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "https://keep-me-webapp.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));
app.use("/auth", authRoute_1.default);
app.use("/user", userRoute_1.default);
app.use(errorHandler_1.default);
async function getDb() {
    try {
        await mongoose_1.default.connect("mongodb+srv://tristanvicclarito2003:WX3aVuUZ2ELqci1m@cluster0.dkbqliv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    }
    catch (err) {
        console.log(err);
    }
}
getDb();
app.listen(PORT, () => {
    console.log("Server is listening!!");
});

