import { diseaseCard, allDiseasesType, oneDiseaseCaseMenu, oneDiseaseCaseDetail } from './caseTypeDefine.tsx';

export const dataFrom_Categories : allDiseasesType[] = [
  {
      "typeId": 0,
      "typeName": "皮肤病",
      "diseaseDTOList": [
          {
              "diseaseId": 3,
              "diseaseName": "皮肤过敏",
              "typeName": "皮肤病"
          },
          {
              "diseaseId": 4,
              "diseaseName": "湿疹",
              "typeName": "皮肤病"
          }
      ]
  },
  {
      "typeId": 1,
      "typeName": "肠胃病",
      "diseaseDTOList": [
          {
              "diseaseId": 1,
              "diseaseName": "胃炎",
              "typeName": "肠胃病"
          },
          {
              "diseaseId": 2,
              "diseaseName": "慢性肠炎",
              "typeName": "肠胃病"
          },
          {
              "diseaseId": 5,
              "diseaseName": "急性胃炎",
              "typeName": "肠胃病"
          }
      ]
  }
]

export const dataFrom_oneDiseaseCaseMenu: oneDiseaseCaseMenu[] = [
  {
      "caseId": 1,
      "caseName": "英短猫胃炎病例",
      "admissionText": "接诊信息患者是一只成年英短猫，情绪低落，厌食",
      "frontGraph": require('../../Assets/image/cat2.png')
  },
  {
      "caseId": 2,
      "caseName": "哈士奇胃炎病例",
      "admissionText": "接诊信息患者是一只成年哈士奇，情绪低落，厌食",
      "frontGraph": require('../../Assets/image/cat3.png')
  },
  {
    "caseId": 2,
    "caseName": "边牧狗狗胃炎病例",
    "admissionText": "接诊信息患者是一只成年哈士奇，情绪低落，厌食",
    "frontGraph": require('../../Assets/image/cat4.png')
}
]

export const dataFrom_oneDiseaseCaseDetail: oneDiseaseCaseDetail = {
  "caseId": 0,
  "caseName": "",
  "admissionText": "接",
  "admissionGraphList": [
     require('../../Assets/image/cat2.png'),
     require('../../Assets/image/cat3.png')
  ],
  "inspectionFrontDTOList": [
      {
          "inspectionCaseId": 1,
          "departmentName": "化验室",
          "itemName": "查血",
          "result": "无感染",
          "intro": "验血相关xxxx",
          "fee": 100.0,
          "inspectionGraphList": [
              "xxxi1",
              "xxxi2"
          ]
      },
      {
          "inspectionCaseId": 2,
          "departmentName": "化验室",
          "itemName": "查血",
          "result": "血细胞较低",
          "intro": "验血相关xxxx",
          "fee": 100.0,
          "inspectionGraphList": [
              "xxxi1",
              "xxxi2"
          ]
      },
      {
          "inspectionCaseId": 3,
          "departmentName": "放射室",
          "itemName": "拍x光",
          "result": "没有骨折",
          "intro": "检查胸腔是否骨折",
          "fee": 200.0,
          "inspectionGraphList": [
              "xxxi1"
          ]
      }
  ],
  "diagnosticInfo": "诊断信息为慢性胃炎",
  "treatmentInfo": "需要吃一周xx胃炎药，一天一次",
  "treatmentGraphList": [
      "xxxt1",
      "xxxt2"
  ],
  "treatmentVideoList": []
}

export const caseData: diseaseCard[] = [
    {
      id: 1,
      title: "蛔虫病",
      content:"影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat2.png')
    },
    {
      id: 1,
      title: "皮肤病",
      content:"影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat3.png')
    },
    {
      id: 1,
      title: "钩虫病",
      content:"影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat4.png')
    },
    {
      id: 1,
      title: "蛔虫病",
      content:"影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat5.png')
    },
    {
      id: 1,
      title: "蛔虫病",
      content:"影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat6.png')
    },
    {
      id: 1,
      title: "蛔虫病",
      content:"影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat7.png')
    },
    {
      id: 2,
      title: "钩虫病",
      content: "影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat4.png')
    },
    {
      id: 2,
      title: "钩虫病",
      content: "影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat2.png')
    },
    {
      id: 2,
      title: "钩虫病",
      content: "蛔虫病是影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat3.png')
    },
    {
      id: 2,
      title: "钩虫病",
      content: "蛔虫病是影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat4.png')
    },
    {
      id: 2,
      title: "钩虫病",
      content: "蛔虫病是影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat5.png')
    },
    {
      id: 2,
      title: "钩虫病",
      content: "蛔虫病是影响狗狗肠胃的一种常见疾病，蛔虫会寄生在狗狗的肠道和胃部当中",
      image:require('../../Assets/image/cat6.png')
    },
  ]
  
  export const caseType: string[] = [
    "传染病","寄生虫病","内科病","免疫"
  ]