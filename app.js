const env = require("dotenv").config();
const express = require('express');
const app = express();


const studentRoute = require("./routes/student_route");
app.use("/student", studentRoute);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

