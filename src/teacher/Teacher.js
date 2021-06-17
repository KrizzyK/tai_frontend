import Student from "../student/Student";
import React, {useEffect, useState} from "react";
import update from 'immutability-helper';
import {formatDate} from "../Date";
import TeacherDto from "./TeacherDto";
import StudentDto from "../student/StudentDto";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

class TeacherProps {
    key: Number;
    teacher: TeacherDto;
    deleteTeacher: Function;
    updateTeacher: Function;
}

function Teacher(props: TeacherProps) {

    // teacher
    const [isEditTeacherPopUpOpen, setisEditTeacherPopUpOpen] = useState(false);

    const [firstNameTeacher, setFirstNameTeacher] = useState(props.teacher.firstName);
    const [lastNameTeacher, setLastNameTeacher] = useState(props.teacher.lastName);

    const [firstNameEditTeacherInput, setFirstNameTeacherInput] = useState(props.teacher.firstName);
    const [lastNameEditTeacherInput, setLastNameTeacherInput] = useState(props.teacher.lastName);

    // his students
    const [isAddStudentPopUpOpen, setIsAddStudentPopUpOpen] = useState(false);

    const [firstNameNewStudentInput, setFirstNameStudentInput] = useState("");
    const [lastNameNewStudentInput, setLastNameStudentInput] = useState("");
    const [gradeAverageNewStudentInput, setgradeAverageStudentInput] = useState(2.0);

    const [teacher, setTeacher] = useState(props.teacher);
    const [students, setStudents] = useState(props.teacher.students);


    const updateTeacher = (event) => {
        toggleEditTeacherPopup();
        setFirstNameTeacher(firstNameEditTeacherInput);
        setLastNameTeacher(lastNameEditTeacherInput);
        props.updateTeacher(
            event,
            {
                id: props.teacher.id,
                firstName: firstNameEditTeacherInput,
                lastName: lastNameEditTeacherInput
            });
    }
    const deleteTeacher = (event) => {
        event.preventDefault();
        toggleEditTeacherPopup();
        props.deleteTeacher(props.teacher.id);
    }

    const toggleEditTeacherPopup = () => {
        setisEditTeacherPopUpOpen(!isEditTeacherPopUpOpen);
    }


    const deleteStudent = (id: Number) => {
        axios.delete('http://localhost:8080/api/student/' + id)
            .then((response) => {
                const newList = students.filter((student) => student.id !== id);
                setStudents(newList);
            }).catch(function (error) {
            console.log("Error")
        });
    }
    const updateStudent = (event, newStudent: StudentDto) => {
        axios.put('http://localhost:8080/api/student?teacherId=' + teacher.id, newStudent)
            .then((response) => {
                const index = students.findIndex((stud) => stud.id === newStudent.id);
                const updatedStudents = update(students, {$splice: [[index, 1, newStudent]]});
                setStudents(updatedStudents);
            }).catch(function (error) {
            console.log("Error")
        });

        event.preventDefault();
    }
    const addNewStudent = (event) => {
        axios.post('http://localhost:8080/api/student?teacherId=' + teacher.id,
            {
                firstName: firstNameNewStudentInput,
                lastName: lastNameNewStudentInput,
                gradeAverage: gradeAverageNewStudentInput
            }
        ).then((response) => {
            const updatedStudents = [...students, response.data];
            setStudents(updatedStudents);
        }).catch(function (error) {
            console.log("Error")
        });
        toggleAddStudentPopup();
        event.preventDefault();
    }

    const toggleAddStudentPopup = () => {
        setIsAddStudentPopUpOpen(!isAddStudentPopUpOpen);
    }


    return (
        <div className="Teacher">
            <li class="list-group-item list-group-item-action list-group-item-primary">Teacher: {firstNameTeacher + " " + lastNameTeacher + ", works here from: " + formatDate(teacher.startedWork)}
                <button type="button" className="btn btn-outline-dark m-1" onClick={toggleEditTeacherPopup}>Edit teacher
                </button>
                {
                    isEditTeacherPopUpOpen &&
                    <form onSubmit={updateTeacher}>
                        <label> First name:
                            <input class="form-control mb-2 mr-sm-2" defaultValue={firstNameEditTeacherInput}
                                   onChange={e => setFirstNameTeacherInput(e.target.value)} type="text" minLength="3"
                                   maxLength="15"/>
                        </label>
                        <label> Last name:
                            <input class="form-control mb-2 mr-sm-2" defaultValue={lastNameEditTeacherInput}
                                   onChange={e => setLastNameTeacherInput(e.target.value)} type="text" minLength="3"
                                   maxLength="15"/>
                        </label>
                        <button type="submit" className="btn btn-success">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={toggleEditTeacherPopup}>Cancel
                        </button>
                        <button type="button" className="btn btn-danger" onClick={deleteTeacher}>Delete</button>
                    </form>
                }
                <ul class="list-group">
                    {students.map((student) =>
                        <Student key={student.id} updateStudent={updateStudent} deleteStudent={deleteStudent}
                                 student={student}/>
                    )}
                </ul>
                <button type="button" className="btn btn-outline-dark m-1" onClick={toggleAddStudentPopup}>Add student
                </button>
                {
                    isAddStudentPopUpOpen &&
                    <form onSubmit={addNewStudent}>
                        <label> First name:
                            <input class="form-control mb-2 mr-sm-2"
                                   onChange={e => setFirstNameStudentInput(e.target.value)} type="text" minLength="3"
                                   maxLength="15"/>
                        </label>
                        <label> Last name:
                            <input class="form-control mb-2 mr-sm-2"
                                   onChange={e => setLastNameStudentInput(e.target.value)} type="text" minLength="3"
                                   maxLength="15"/>
                        </label>
                        <label> Grade average:
                            <input class="form-control mb-2 mr-sm-2" defaultValue="2.0"
                                   onChange={e => setgradeAverageStudentInput(e.target.value)} type="number" step="0.01"
                                   min="2.0" max="5.0"/>
                        </label>
                        <button type="submit" className="btn btn-success">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={toggleAddStudentPopup}>Cancel
                        </button>
                    </form>
                }
            </li>
        </div>
    );
}

export default Teacher;