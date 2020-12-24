
class GraphicalModels {
    subface = map(23, 15);
}

function map(r, c) {
    let data = [];
    for (let i = 0; i < r; i++) {
        data.push([]);
        for (let j = 0; j < c; j++) {
            data[i].push([0, 'white'])
            // data[i].push(0)
        }
    }
    return data;
}

export default GraphicalModels
