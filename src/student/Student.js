import React, {useEffect, useState} from "react";
import StudentDto from "./StudentDto";
import 'bootstrap/dist/css/bootstrap.min.css';

class StudentProps {
    key: Number;
    student: StudentDto;
    deleteStudent: Function;
    updateStudent: Function;
}


function Student(props: StudentProps) {
    const [isEditStudentPopUpOpen, setisEditStudentPopUpOpen] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gradeAverage, setgradeAverage] = useState(2.0);

    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
    const [gradeAverageInput, setgradeAverageInput] = useState(2.0);

    useEffect(() => {
        setFirstName(props.student.firstName);
        setLastName(props.student.lastName);
        setgradeAverage(props.student.gradeAverage);

        setFirstNameInput(props.student.firstName);
        setLastNameInput(props.student.lastName);
        setgradeAverageInput(props.student.gradeAverage);

    }, []);

    const updateStudent = (event) => {
        toggleEditStudentPopUp();
        setFirstName(firstNameInput);
        setLastName(lastNameInput);
        setgradeAverage(gradeAverageInput);
        props.updateStudent(
            event,
            {
                id: props.student.id,
                firstName: firstNameInput,
                lastName: lastNameInput,
                gradeAverage: gradeAverageInput
            });
    }
    const deleteStudent = (event) => {
        props.deleteStudent(props.student.id);
        event.preventDefault();
        toggleEditStudentPopUp();
    }

    const toggleEditStudentPopUp = () => {
        setisEditStudentPopUpOpen(!isEditStudentPopUpOpen);
    }

    return (
        <div className="Student">
            <li class="list-group-item list-group-item-action list-group-item-secondary">{"Student: " + firstName + " " + lastName + ". Average grade = " + gradeAverage}

                <button type="button" className="btn btn-outline-dark m-1" onClick={toggleEditStudentPopUp}>Edit student
                </button>
                {isEditStudentPopUpOpen &&
                <form class="form-inline" onSubmit={updateStudent}>
                    <label> First name:
                        <input class="form-control mb-2 mr-sm-2" defaultValue={firstNameInput}
                               onChange={e => setFirstNameInput(e.target.value)} type="text" minLength="3"
                               maxLength="15"/>
                    </label>
                    <label> Last name:
                        <input class="form-control mb-2 mr-sm-2" defaultValue={lastNameInput}
                               onChange={e => setLastNameInput(e.target.value)} type="text" minLength="3"
                               maxLength="15"/>
                    </label>
                    <label> Grade average:
                        <input class="form-control mb-2 mr-sm-2" defaultValue={gradeAverageInput}
                               onChange={e => setgradeAverageInput(e.target.value)} type="number" step="0.01" min="2.0"
                               max="5.0"/>
                    </label>
                    <button type="submit" class="btn btn-success">Save</button>
                    <button type="button" class="btn btn-secondary" onClick={toggleEditStudentPopUp}>Cancel</button>
                    <button type="button" class="btn btn-danger" onClick={deleteStudent}>Delete</button>

                </form>
                }
            </li>
        </div>
    );
}

export default Student;