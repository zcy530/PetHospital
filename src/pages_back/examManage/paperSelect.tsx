import React, { useEffect, useState } from 'react';
import {
    Alert,
    Select,
    Spin
} from 'antd';
import Loading from '../global/loading.tsx'


const { Option } = Select;


interface defaultOption {
    value: number,
    label: string
}

interface paperOption {
    id: number,
    name: string
}

export interface paperProps {
    defaultPaper: defaultOption;
    getPaper: (getPaperId: number) => void;
}


const PaperSelect = (props: paperProps) => {
    // console.log("paper props:")
    // console.log(props);

    const [defaultPaper, setDefaultPaper] = useState<defaultOption>({ "value": 0, "label": "" });
    const [paperList, setPaper] = useState<paperOption[]>([]);

    useEffect(() => {

        fetch('http://localhost:8080/petHospital/papers'
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

        if (props.defaultPaper) {
            console.log(props.defaultPaper);
            setDefaultPaper(props.defaultPaper);
            console.log("props默认为" + props.defaultPaper.value);
            console.log("默认为" + defaultPaper.value);
        }

    }, []);


    const handleChange = (e) => {
        console.log(e);
        props.getPaper(e);
    }

    const paper = { "label": "肠胃病考试试卷", "value": 1 }

    return (
        <Select
            size="large"
            showSearch //带搜索的选择框
            style={{ width: 160 }}
            placeholder="Select a paper"
            onChange={handleChange}
            defaultValue={props.defaultPaper ? defaultPaper : null}
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