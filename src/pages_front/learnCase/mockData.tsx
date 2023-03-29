import { diseaseCard, diseaseInfo } from './caseTypeDefine';

export const dataFrom_Categories : diseaseInfo[] = [
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