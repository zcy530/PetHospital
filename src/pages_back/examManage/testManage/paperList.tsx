
interface paperOption {
    id: number,
    name: string
}

const getPaper = () => {
    let paperList: paperOption[] = [];
    fetch("http://localhost:8080/petHospital/papers")
        .then(
            (response) => response.json(),
        )
        .then((data) => {
            console.log(data.result);
            const lists = data.result;
            lists.map(list => {
                paperList.push({ "id": list.paperId, "name": list.paperName })
            })
            console.log(paperList)
        })
        .catch((err) => {
            console.log(err.message);
        });
    return paperList;
}


export const paperList = getPaper();
