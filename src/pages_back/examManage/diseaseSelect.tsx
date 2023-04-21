import React, { useEffect, useState } from 'react';
import { Select,} from 'antd';

interface diseaseOption {
    id: number,
    text: string,
    value: string
  }
  

const DiseaseTypeSelect: React.FC = () => {

    const [disease, setDisease] = useState<diseaseOption[]>([]);

    useEffect(() => {
        fetch('https://47.120.14.174:443/petHospital/diseases'
        )
          .then(
            (response) => response.json(),
          )
          .then((data) => {
            console.log(data.result);
            const lists = data.result;
            let diseaseList = [...disease];
            lists.map(list => {
              // console.log(list.typeName)
              diseaseList.push({"id": list.typeId, "text": list.typeName, "value": list.typeName })
            })
            setDisease(diseaseList);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }, []);


    return (
        <Select
            size="large"
            showSearch //带搜索的选择框
            style={{ width: 160 }}
            placeholder="Select a paper"
        // options={papers ? papers : []}
        // optionFilterProp="children"
        // filterOption={(input, option) =>
        //     option?.value.startsWith(input)
        // }
        >

        </Select>
    )


}

export default DiseaseTypeSelect;