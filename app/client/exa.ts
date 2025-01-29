import { Provider } from "./api";
import EXA from 'exa-js';

export const Exa: Provider = {
    name:"Exa",
    fields:["apiKey"],
    search:{
        getApi(options: { apiKey: string }) {
            return async (
                query: string,
                count: number
            ) => {
                const exa = new EXA(options.apiKey);
                const result = await exa.searchAndContents(
                    query, {
                        summary: true
                    }
                );
                return result.results.map(r=>{return {url:r.url, digest: r.summary}})
            }
        }
    }
}