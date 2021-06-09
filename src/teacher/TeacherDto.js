import StudentDto from "../student/StudentDto";

class TeacherDto {
    id: Number;
    firstName: String;
    lastName: String;
    startedWork: String;
    students: StudentDto[];
}
export default TeacherDto;