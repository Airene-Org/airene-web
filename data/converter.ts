import data from './original.json' with { type: "json" };

const newData = {
    data: [
        ...Object.entries(data).map(([, value]) => {
            return value
        })
    ]
}

Deno.writeTextFileSync('./data/data.json', JSON.stringify(newData));
