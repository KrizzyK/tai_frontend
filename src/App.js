import React, {useEffect, useState} from "react";
import axios from 'axios';
import update from 'immutability-helper';
import Teacher from "./teacher/Teacher";
import TeacherDto from "./teacher/TeacherDto";

function App() {
  const [teachers, setTeachers] = useState([] );
  const [isAddTeacherPopUpOpen, setIsAddTeacherPopUpOpen] = useState(false);


  const [firstNameNewTeacherInput, setFirstNameTeacherInput] = useState("");
  const [lastNameNewTeacherInput, setLastNameTeacherInput] = useState("");

  useEffect(() => {
    axios.get(
        'http://localhost:8080/api/teacher'
    ).then( (response) => {
        setTeachers(response.data);
    }).catch(function(error){
        console.log("Error")
    });
  }, []);

  const deleteTeacher = (id: Number) => {
      axios.delete('http://localhost:8080/api/teacher/' + id)
      .then( (response) => {
          const newList = teachers.filter((teacher) => teacher.id !== id);
          setTeachers(newList);
      }).catch(function(error){
          console.log("Error")
      });
  }
  const updateTeacher = (event, newTeacher: TeacherDto) => {
    axios.put('http://localhost:8080/api/teacher' , newTeacher)
        .then( (response) => {
          const index = teachers.findIndex((teacher) => teacher.id === newTeacher.id);
          const updatedTeachers = update(teachers, {$splice: [[index, 1, newTeacher]]});
          setTeachers(updatedTeachers);
        }).catch(function(error){
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
      ).then( (response) => {
        const updatedTeachers = [...teachers, response.data];
        setTeachers(updatedTeachers);
      }).catch(function(error){
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
        <ul>
          {teachers.map((teacher) =>
              <Teacher key={teacher.id} updateTeacher={updateTeacher} deleteTeacher={deleteTeacher}  teacher={teacher}/>
          )}
        </ul>
      <input type="button" value="Add teacher" onClick={toggleAddTeacherPopup}/>
      {
        isAddTeacherPopUpOpen &&
        <form onSubmit={addNewTeacher}>
          <label> First name:
            <input onChange={e => setFirstNameTeacherInput(e.target.value)} type="text" minLength="3" maxLength="15"/>
          </label>
          <label> Last name:
            <input onChange={e => setLastNameTeacherInput(e.target.value)} type="text" minLength="3" maxLength="15"/>
          </label>
          <input type="submit" value="Save"/>
          <input type="button" value="Cancel" onClick={toggleAddTeacherPopup}/>
        </form>
      }
    </div>
  );
}

export default App;
