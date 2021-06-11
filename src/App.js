import React, {useEffect, useState} from "react";
import axios from 'axios';
import update from 'immutability-helper';
import Teacher from "./teacher/Teacher";
import TeacherDto from "./teacher/TeacherDto";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [teachers, setTeachers] = useState([]);
    const [isAddTeacherPopUpOpen, setIsAddTeacherPopUpOpen] = useState(false);


    const [firstNameNewTeacherInput, setFirstNameTeacherInput] = useState("");
    const [lastNameNewTeacherInput, setLastNameTeacherInput] = useState("");

    useEffect(() => {
        axios.get(
            'http://localhost:8080/api/teacher'
        ).then((response) => {
            setTeachers(response.data);
        }).catch(function (error) {
            console.log("Error")
        });
    }, []);

    const deleteTeacher = (id: Number) => {
        axios.delete('http://localhost:8080/api/teacher/' + id)
            .then((response) => {
                const newList = teachers.filter((teacher) => teacher.id !== id);
                setTeachers(newList);
            }).catch(function (error) {
            console.log("Error")
        });
    }
    const updateTeacher = (event, newTeacher: TeacherDto) => {
        axios.put('http://localhost:8080/api/teacher', newTeacher)
            .then((response) => {
                const index = teachers.findIndex((teacher) => teacher.id === newTeacher.id);
                const updatedTeachers = update(teachers, {$splice: [[index, 1, newTeacher]]});
                setTeachers(updatedTeachers);
            }).catch(function (error) {
            console.log("Error")
        });

        event.preventDefault();
    }
    const addNewTeacher = (event) => {
        axios.post('http://localhost:8080/api/teacher',
            {
                firstName: firstNameNewTeacherInput,
                lastName: lastNameNewTeacherInput,
            }
        ).then((response) => {
            const updatedTeachers = [...teachers, response.data];
            setTeachers(updatedTeachers);
        }).catch(function (error) {
            console.log("Error")
        });
        toggleAddTeacherPopup();
        event.preventDefault();
    }

    const toggleAddTeacherPopup = () => {
        setIsAddTeacherPopUpOpen(!isAddTeacherPopUpOpen);
    }

    return (
        <div className="App">
            <ul class="list-group">
                {teachers.map((teacher) =>
                    <Teacher key={teacher.id} updateTeacher={updateTeacher} deleteTeacher={deleteTeacher}
                             teacher={teacher}/>
                )}
            </ul>
            <button type="button" className="btn btn-outline-dark m-1" onClick={toggleAddTeacherPopup}>Add teacher
            </button>
            {
                isAddTeacherPopUpOpen &&
                <form onSubmit={addNewTeacher}>
                    <label> First name:
                        <input class="form-control mb-2 mr-sm-2"
                               onChange={e => setFirstNameTeacherInput(e.target.value)} type="text" minLength="3"
                               maxLength="15"/>
                    </label>
                    <label> Last name:
                        <input class="form-control mb-2 mr-sm-2" onChange={e => setLastNameTeacherInput(e.target.value)}
                               type="text" minLength="3"
                               maxLength="15"/>
                    </label>
                    <button type="submit" className="btn btn-success">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={toggleAddTeacherPopup}>Cancel</button>
                </form>
            }
        </div>
    );
}

export default App;
