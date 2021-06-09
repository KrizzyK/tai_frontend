import Student from "../student/Student";
import React, {useEffect, useState} from "react";
import update from 'immutability-helper';
import {formatDate} from "../Date";
import TeacherDto from "./TeacherDto";
import StudentDto from "../student/StudentDto";
import axios from "axios";

class TeacherProps{
    key: Number;
    teacher: TeacherDto;
}

function Teacher(props: TeacherProps) {
    const [isAddStudentPopUpOpen, setIsAddStudentPopUpOpen] = useState(false);
    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
    const [gradeAverageInput, setgradeAverageInput] = useState(2.0);

    const [teacher, setTeacher] = useState(
        {
            id: 0,
            firstName: "",
            lastName: "",
            startedWork: ""
        }
    );
    const [students, setStudents] = useState([]);


    useEffect(() => {
        setTeacher(props.teacher);
        setStudents(props.teacher.students)
    }, []);

    const deleteStudent = (id: Number) => {
        const newList = students.filter((student) => student.id === id);
        setStudents(newList);
    }
    const updateStudent = (event, newValues: StudentDto) => {
        const index = students.findIndex((stud) => stud.id === newValues.id);
        const updatedStudents = update(students, {$splice: [[index, 1, newValues]]});
        setStudents(updatedStudents);
        event.preventDefault();
    }
    const addNewStudent = (event) => {
        axios.post('http://localhost:8080/api/student?teacherId=' +teacher.id,
            {
                firstName: firstNameInput,
                lastName: lastNameInput,
                gradeAverage: gradeAverageInput
            }
        ).then( (response) => {
            const updatedStudents = [...students, response.data];
            setStudents(updatedStudents);
        }).catch(function(error){
            console.log("Error")
        });

        // const updatedStudents = [
        //     ...students,
        //     {
        //         id: students.slice(-1)[0] + 1, //last element's id + 1
        //         firstName: firstNameInput,
        //         lastName: lastNameInput,
        //         gradeAverage: gradeAverageInput
        //     }];
        // setStudents(updatedStudents);
        event.preventDefault();
    }

    const toggleAddStudentPopup = () => {
        setIsAddStudentPopUpOpen(!isAddStudentPopUpOpen);
    }

    return (
        <div className="Teacher">
            <h1>Teacher: {teacher.firstName + " " + teacher.lastName + ", works here from: " + formatDate(teacher.startedWork)}</h1>
            <ul>
                {students.map((student,idx) =>
                    <Student key={idx} updateStudent={updateStudent} deleteStudent={deleteStudent} student={student}/>
                )}
            </ul>
            <input type="button" value="Add student" onClick={toggleAddStudentPopup}/>
            {isAddStudentPopUpOpen &&
            <form onSubmit={addNewStudent}>
                <label> First name:
                    <input  onChange={e => setFirstNameInput(e.target.value)}  type="text" minLength="3" maxLength="15"/>
                </label>
                <label> Last name:
                    <input  onChange={e => setLastNameInput(e.target.value)} type="text" minLength="3" maxLength="15"/>
                </label>
                <label> Grade average:
                    <input onChange={e => setgradeAverageInput(e.target.value)} type="number" step="0.01" min="2.0" max="5.0"/>
                </label>
                <input type="submit" value="Save" />
                <input type="button" value="Cancel" onClick={toggleAddStudentPopup} />
            </form>
            }

        </div>
    );
}

export default Teacher;