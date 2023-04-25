
export interface DiseaseInfo {
  diseaseId: number;
  diseaseName: string;
  typeName: string;
}

export interface diseaseOption {
  id: number,
  text: string,
  value: string
}


//获取疾病的类别目录
export function getCategoryList(token: string) {
  let diseaseList: diseaseOption[] = [];
  //获取后台数据
  fetch("https://47.120.14.174:443/petHospital/categories",
    { headers: { 'Authorization': token } }
  )
    .then(
      (response) => response.json(),
    )
    .then((data) => {
      console.log(data.result);
      const lists = data.result;

      lists.map(list => {
        // console.log(list.typeName)
        diseaseList.push({ "id": list.typeId, "text": list.typeName, "value": list.typeName })
      })
      console.log(diseaseList)
    })
    .catch((err) => {
      console.log(err.message);
    });

  return diseaseList;
}

//获取疾病/病种列表
export const getDiseaseList = (token: string) => {
  let diseaseList: diseaseOption[] = [];
  //获取后台数据
  fetch("https://47.120.14.174:443/petHospital/diseases",
    { headers: { 'Authorization': token } }
  )
    .then(
      (response) => response.json(),
    )
    .then((data) => {
      console.log(data.result);
      const lists = data.result;

      lists.map(list => {
        // console.log(list.typeName)
        diseaseList.push({ "id": list.diseaseId, "text": list.diseaseName, "value": list.diseaseName })
      })
      console.log(diseaseList)
    })
    .catch((err) => {
      console.log(err.message);
    });

  return diseaseList;
}


//疾病类别
// export const diseaseType = getDiseaseList();

// export const diseaseCategory = getCategoryList();