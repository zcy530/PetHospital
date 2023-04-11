//这里定义病例数据属性
export type CaseType = {
  key: number;
  case_id: number;
  case_name: string;
  disease_name: string;
  disease_type: string;
}

export type InspectionType = {
  inspection_item_id: number;
  inspection_name: string;
  inspection_result_text: string;
  inspection_graphs: [];
}

export type CaseFormType = {
  admission_graphs: string[],
  admission_text: string,
  // case_id: number,
  case_title: string,
  diagnostic_result: string,
  disease_id: number,
  front_graph: string,
  inspection_cases: InspectionType[],
  //   {
  //     "inspection_graphs": [
  //       "string"
  //     ],
  //     "inspection_item_id": 0,
  //     "inspection_result_text": "string"
  //   }
  // ],
  therapy_graphs: string[],
  therapy_videos: string[],
  treatment_info: string
}