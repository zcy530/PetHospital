export type diseaseCard = {
    id: number;
    title: string;
    content: string;
    image:string;
  };

export type allDiseasesType = {
  typeId: number;
  typeName: string;
  diseaseDTOList: subDiseaseType[];
}

export type subDiseaseType = {
  diseaseId: number;
  diseaseName: string;
  typeName: string;
}

export type oneDiseaseCaseMenu = {
  caseId: number,
  caseName: string,
  admissionText: string,
  frontGraph: string
}

export type inspectionList = {
  inspectionCaseId: number,
  departmentName: string,
  itemName: string,
  result: string,
  intro: string,
  fee: number,
  inspectionGraphList: string[]
}

export type oneDiseaseCaseDetail = {
  caseId: number,
  caseName: string,
  admissionText: string,
  admissionGraphList: string[],
  inspectionFrontDTOList: inspectionList[],
  diagnosticInfo: string,
  treatmentInfo: string,
  treatmentGraphList: string[],
  treatmentVideoList: string[],
}

