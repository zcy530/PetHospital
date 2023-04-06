export type DiseaseInfo = {
  diseaseId: number;
  diseaseName: string;
  typeName: string;
}

interface diseaseOption {
  text: string,
  value: string
}

const getDiseaseList = () => {
  //获取后台数据
  fetch("http://localhost:8080/petHospital/categories"
  )
    .then(
      (response) => response.json(),
    )
    .then((data) => {
      console.log(data.result);
      const lists = data.result;
      const diseaseList: diseaseOption[] = []; //初始化diseaseList
      lists.map(list => {
        console.log(list.typeName)
        diseaseList.push({ "text": list.typeName, "value": list.typeName })
      })
      console.log(diseaseList)
    })
    .catch((err) => {
      console.log(err.message);
    });
  return getDiseaseList;
}

//疾病类别
export const diseaseType = [
  {
    text: '寄生虫病',
    value: '寄生虫病',
  },
  {
    text: '内科病',
    value: '内科病',
  },
  {
    text: '肠胃病',
    value: '肠胃病',
  },
  {
    text: '皮肤病',
    value: '皮肤病',
  }
]

