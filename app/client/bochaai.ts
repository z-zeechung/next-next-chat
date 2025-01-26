import { Provider } from "./api";

export const BochaAI: Provider = {
    name: "BochaAI (博查)",
    fields: ["apiKey"],
    search: {
        getApi(options: { apiKey: string }) {
            return (
                query: string,
                count: number
            ) => {
                return new Promise(async resolve => {
                    const url = 'https://api.bochaai.com/v1/web-search';
                    const headers = {
                        'Authorization': `Bearer ${options.apiKey}`,
                        'Content-Type': 'application/json'
                    };
                    const data = {
                        "query": query,
                        "freshness": "noLimit",
                        "summary": true,
                        "count": Math.max(count, 10)
                    };
                    const resp = await (await fetch(url, {
                        method: "POST",
                        headers,
                        body: JSON.stringify(data)
                    })).json();
                    resolve(resp.data.webPages.value.map(r=>{return {
                        url: r.displayUrl, 
                        digest: r.summary
                    }}));
                })
            }
        },
    }
}