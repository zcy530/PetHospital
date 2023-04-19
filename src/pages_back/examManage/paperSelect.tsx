import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import Loading from '../global/loading.tsx'


const { Option } = Select;

interface paperOption {
    id: number,
    name: string
}


const PaperSelect = (props) => {
    // console.log("paper props:")
    console.log(props);

    const [paperList, setPaper] = useState<paperOption[]>([]);

    useEffect(() => {

        fetch('https://47.120.14.174:443/petHospital/papers'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // console.log(data.result);
                const lists = data.result;
                let paper_List: paperOption[] = [];
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
                        <Loading />
                    </>
                )
            }
        </Select>
    )
}

export default PaperSelect;