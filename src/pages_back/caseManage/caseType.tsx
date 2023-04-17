//这里定义病例数据属性
//病例table类型
export type CaseType = {
  key: number;
  case_id: number;
  case_name: string;
  disease_name: string;
  disease_type: string;
}

//病例中检查类型
export type InspectionType = {
  inspection_item_id: number;
  inspection_name: string;
  inspection_result_text: string;
  inspection_graphs: [];
}

//检查项目结果图片
export type InspectionGraphType = {
  caseId: number,
  fileId: number,
  sortNum: number,
  url: string
}

//疾病
export type DiseaseType = {
  diseaseId: number;
  diseaseName: string;
  typeName: string;
}

//检查项目基本信息
export type InspectionItemType = {
  itemId: number;
  itemName: string
}

//检查项目与病例关联信息
export type InspectionInfo = {
  inspectionCaseId: number;
  inspectionGraphs: InspectionGraphType[];
  inspectionItem: InspectionItemType;
  result: string;
}


//病例详细信息，form类型
export type CaseFormType = {
  admissionGraphList: string[],
  admissionText: string,
  caseId: number,
  caseName: string,
  diagnosticInfo: string,
  disease: DiseaseType,
  frontGraph: string,
  inspectionCaseList: InspectionInfo[],
  treatmentGraphList: string[],
  treatmentVideoList: string[],
  treatmentInfo: string
}