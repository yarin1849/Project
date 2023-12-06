const Student = require("../models/student_model");

const getAllStudents = async (req, res) => {
    console.log("getAllStudents");
    try{
        let students = ""
        if (req.query.name){
            console.log("getStudentByName");
            students = await Student.find({name: req.query.name});
        } else {
            console.log("getallstudents");
           students = await Student.find();
        }
        res.send(students);
    }   catch (err) {
        res.status(500).json({message: err.message});
    }
};

const getStudentById = async (req, res) => {
    console.log("getStudentById");
    try{
        const students = await Student.findById(req, res);
        res.send(students);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

const postStudent = async(req, res) => {
    console.log("postStudent:" + req.body);

    const student = new Student(req.body);
    try{
        await student.save();
        res.send("OK");
    } catch (err) {
        console.log(err);
        res.send("fail: " + err.message);
    }
};

const putStudentById = (req, res) =>{
    res.send("put student by id: " + req.params.id);
};

const deleteStudentById = (req, res) => {
    res.send("delete student by id: " + req.params.id);
};

module.exports = {
    getAllStudents,
    getStudentById,
    postStudent,
    putStudentById,
    deleteStudentById,
};

