export type diseaseCard = {
    id: number;
    title: string;
    content: string;
    image:string;
  };

export type diseaseInfo = {
  typeId: number;
  typeName: string;
  diseaseDTOList: diseaseCase[];
}

export type diseaseCase = {
  diseaseId: number;
  diseaseName: string;
  typeName: string;
}
