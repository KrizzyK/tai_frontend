import React, {useEffect, useState} from "react";
import axios from 'axios';
import Teacher from "./teacher/Teacher";

function App() {
  const [teachers, setTeachers] = useState([] );

  useEffect(() => {
    axios.get(
        'http://localhost:8080/api/teacher'
    ).then( (response) => {
        setTeachers(response.data)
    }).catch(function(error){
        console.log("Error")
    });
  }, []);


  return (
    <div className="App">
      {teachers.map(teacher =>
          <Teacher key={teacher.id}  teacher={teacher}/>
      )}
    </div>
  );
}

export default App;
