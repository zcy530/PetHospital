import React, { useEffect, useState } from 'react';
import {
    Alert,
    Select,
    Spin
} from 'antd';

const { Option } = Select;

interface paperOption {
    id: number,
    name: string
}


const PaperSelect: React.FC = (props) => {

    const [paperList, setPaper] = useState<paperOption[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/petHospital/papers'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                const lists = data.result;
                let paper_List : paperOption[] = [];
                lists.map(list => {
                    paper_List.push({ "id": list.paperId, "name": list.paperName })
                })
                //赋值给paper
                setPaper(paper_List);
            })
            .catch((err) => {
                console.log(err.message);
            });
    
    }, []);

    
    const handleChange = (e) => {
        console.log(e);
        props.getPaper(e);
    }

    return (
        <Select
            size="large"
            showSearch //带搜索的选择框
            style={{ width: 160 }}
            placeholder="Select a paper"
            onChange={handleChange}
        >
            {
                paperList ? (
                    paperList.map(paper =>
                        <Option key={paper.id}> {paper.name} </Option>
                    )
                ) : (
                    <>
                        <Spin tip="加载中...">
                            <Alert
                                message="疯狂加载中"
                                description="不要走开喵"
                                type="info"
                            />
                        </Spin>
                    </>
                )
            }
        </Select>
    )


}

export default PaperSelect;