import React, {useEffect, useState} from "react";
import StudentDto from "./StudentDto";

class StudentProps {
    student: StudentDto;
    deleteStudent: Function;
    updateStudent: Function;
}


function Student(props: StudentProps) {
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);

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

    const updateStudent = (event) =>  {
        togglePopup();
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
        event.preventDefault();
        togglePopup();
        props.deleteStudent(props.student.id);
    }
    const togglePopup = () => {
        setIsPopUpOpen(!isPopUpOpen);
    }

    return (
        <div className="Student">
            <li>{"Student: " + firstName + " " + lastName + ". Average grade = " + gradeAverage}
                <input type="button" value="Edit" onClick={togglePopup}/>
                {isPopUpOpen &&
                        <form onSubmit={updateStudent}>
                            <label> First name:
                                <input defaultValue={firstNameInput} onChange={e => setFirstNameInput(e.target.value)}  type="text" minLength="3" maxLength="15"/>
                            </label>
                            <label> Last name:
                                <input defaultValue={lastNameInput} onChange={e => setLastNameInput(e.target.value)} type="text" minLength="3" maxLength="15"/>
                            </label>
                            <label> Grade average:
                                <input defaultValue={gradeAverageInput} onChange={e => setgradeAverageInput(e.target.value)} type="number" step="0.01" min="2.0" max="5.0"/>
                            </label>
                            <input type="submit" value="Save" />
                            <input type="button" value="Cancel" onClick={togglePopup} />
                            <input type="button" value="Delete" onClick={deleteStudent} />
                        </form>
                }
            </li>
        </div>
    );
}

export default Student;