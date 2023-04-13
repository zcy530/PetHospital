interface studentOption {
    id: number,
    email: string,
    class: string
  }

//获取疾病/病种列表
const getStudentList = () => {
    let studentList: studentOption[] =[];
    //获取后台数据
    fetch("http://localhost:8080/petHospital/users"
    )
      .then(
        (response) => response.json(),
      )
      .then((data) => {
        // console.log(data.result);
        const lists = data.result;

        lists.map(list => {
            if(list.role === "student")
                studentList.push({"id": list.userId, "email": list.email, "class":list.userClass} )
        })
        console.log(studentList)
      })
      .catch((err) => {
        console.log(err.message);
      });
  
    return studentList;
  }
  
  
  //疾病类别
  export const studentList = getStudentList();