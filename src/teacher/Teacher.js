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
    deleteTeacher: Function;
    updateTeacher: Function;
}

function Teacher(props: TeacherProps) {

    // teacher
    const [isEditTeacherPopUpOpen, setisEditTeacherPopUpOpen] = useState(false);

    const [firstNameTeacher, setFirstNameTeacher] = useState("");
    const [lastNameTeacher, setLastNameTeacher] = useState("");

    const [firstNameEditTeacherInput, setFirstNameTeacherInput] = useState("");
    const [lastNameEditTeacherInput, setLastNameTeacherInput] = useState("");

    // his students
    const [isAddStudentPopUpOpen, setIsAddStudentPopUpOpen] = useState(false);

    const [firstNameNewStudentInput, setFirstNameStudentInput] = useState("");
    const [lastNameNewStudentInput, setLastNameStudentInput] = useState("");
    const [gradeAverageNewStudentInput, setgradeAverageStudentInput] = useState(2.0);

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
        setFirstNameTeacher(props.teacher.firstName);
        setLastNameTeacher(props.teacher.lastName);

        setFirstNameTeacherInput(props.teacher.firstName);
        setLastNameTeacherInput(props.teacher.lastName);

        setTeacher(props.teacher);
        setStudents(props.teacher.students);
    }, []);

    const updateTeacher = (event) =>  {
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
            .then( (response) => {
                const newList = students.filter((student) => student.id !== id);
                setStudents(newList);
            }).catch(function(error){
            console.log("Error")
        });
    }
    const updateStudent = (event, newStudent: StudentDto) => {
        axios.put('http://localhost:8080/api/student?teacherId=' +teacher.id, newStudent)
            .then( (response) => {
                const index = students.findIndex((stud) => stud.id === newStudent.id);
                const updatedStudents = update(students, {$splice: [[index, 1, newStudent]]});
                setStudents(updatedStudents);
        }).catch(function(error){
            console.log("Error")
        });

        event.preventDefault();
    }
    const addNewStudent = (event) => {
        axios.post('http://localhost:8080/api/student?teacherId=' +teacher.id,
            {
                firstName: firstNameNewStudentInput,
                lastName: lastNameNewStudentInput,
                gradeAverage: gradeAverageNewStudentInput
            }
        ).then( (response) => {
            const updatedStudents = [...students, response.data];
            setStudents(updatedStudents);
        }).catch(function(error){
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
            <li>Teacher: {firstNameTeacher + " " + lastNameTeacher + ", works here from: " + formatDate(teacher.startedWork)}
                <input type="button" value="Edit teacher" onClick={toggleEditTeacherPopup}/>
                {
                    isEditTeacherPopUpOpen &&
                    <form onSubmit={updateTeacher}>
                        <label> First name:
                            <input defaultValue={firstNameEditTeacherInput} onChange={e => setFirstNameTeacherInput(e.target.value)}  type="text" minLength="3" maxLength="15"/>
                        </label>
                        <label> Last name:
                            <input defaultValue={lastNameEditTeacherInput} onChange={e => setLastNameTeacherInput(e.target.value)} type="text" minLength="3" maxLength="15"/>
                        </label>
                        <input type="submit" value="Save" />
                        <input type="button" value="Cancel" onClick={toggleEditTeacherPopup} />
                        <input type="button" value="Delete" onClick={deleteTeacher} />
                    </form>
                }
                <ul>
                    {students.map((student) =>
                        <Student key={student.id} updateStudent={updateStudent} deleteStudent={deleteStudent} student={student}/>
                    )}
                </ul>
            </li>
            <input type="button" value="Add student" onClick={toggleAddStudentPopup}/>
            {
                isAddStudentPopUpOpen &&
                <form onSubmit={addNewStudent}>
                    <label> First name:
                        <input  onChange={e => setFirstNameStudentInput(e.target.value)}  type="text" minLength="3" maxLength="15"/>
                    </label>
                    <label> Last name:
                        <input  onChange={e => setLastNameStudentInput(e.target.value)} type="text" minLength="3" maxLength="15"/>
                    </label>
                    <label> Grade average:
                        <input onChange={e => setgradeAverageStudentInput(e.target.value)} type="number" step="0.01" min="2.0" max="5.0"/>
                    </label>
                    <input type="submit" value="Save" />
                    <input type="button" value="Cancel" onClick={toggleAddStudentPopup} />
                </form>
            }

        </div>
    );
}

export default Teacher;