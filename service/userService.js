
import TeacherQualification from '../model/TeacherQualification.js'
import User from '../model/user.js'
import StudentProfile from '../model/studentProfile.js'

export const userDashboardService = async (studentId) => {

  // 1. Find student profile
  const student = await StudentProfile.findOne({ userId: studentId });

  if (!student) {
    throw new Error("Student not found");
  }

  const studentClass = student.class;        // "10"
  const studentSubjects = student.subject;   // ["Chemistry"]\
  console.log("student :",student)
  console.log("class :",studentClass, "Subject", studentSubjects)

  // 2. Find matching teachers
  const teachers = await TeacherQualification.find({
    classes: { $in: [studentClass] },
    subjects: { $in: studentSubjects }
  })

  return {
   
    teachers
  };
};