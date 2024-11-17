import { ClientApi } from "@/app/client/api"
import { EXTRACT_ENTITY_COMPLETION } from "./extract-entity-completion"
import { Message } from "@/app/message/Message"
import { EXTRACT_ENTITY_CHAT } from "./extract-entity-chat"

interface Entity { name: string, type: string, description: string }
interface Relationship { source: string, target: string, type: string, description: string }
export async function extract(
    chunks: string[],
    onUpdate?: (
        query: string,
        entities: Entity[],
        relationships: Relationship[]
    ) => void
): Promise<{ entities: Entity[], relationships: Relationship[] }> {
    function match(msg: string): [Entity[], Relationship[]] {
        const ENTITY_REGEX = /\(entity\|(.+?)\|(ORG|PERSON|GEO|EVENT|ITEM|IDEA|ATTR)\|(.+?)\)/g
        const RELATIONSHIP_REGEX = /\(relationship\|(.+?)\|(.+?)\|(EQUAL|IS|AT|BY|OF|FOR|WITH|OPPOSITE|INFER)\|(.+?)\)/g
        function multiMatch(regex, text) {
            let match
            const matches = [] as any[]
            while ((match = regex.exec(text)) !== null) {
                matches.push(match)
            }
            return matches
        }
        var entities = multiMatch(ENTITY_REGEX, msg).map(e => {
            return {
                name: e[1],
                type: e[2],
                description: e[3]
            }
        })
        var relationships = multiMatch(RELATIONSHIP_REGEX, msg).map(e => {
            return {
                source: e[1],
                target: e[2],
                type: e[3],
                description: e[4]
            }
        })
        return [entities, relationships]
    }
    function context2msg(context: { query: string, entities: Entity[], relationships: Relationship[] }[]) {
        var ret = [] as Message[]
        for (const c of context) {
            ret.push({ type: "text", role: "user", content: c.query })
            ret.push({
                type: "text",
                role: "assistant",
                content: c.relationships.map(r => `(relationship|${r.source}|${r.target}|${r.type}|${r.description})`).join("\n")
                    + "\n"
                    + c.entities.map(e => `(entity|${e.name}|${e.type}|${e.description})`).join("\n")
            })
        }
        return ret
    }
    var i = 0
    const context = [] as { query: string, entities: Entity[], relationships: Relationship[] }[]
    while (i < chunks.length) {
        if (i < 3) {
            const chunk = chunks[i]
            const result = await ClientApi.chat(
                [
                    ...(context2msg(context).slice(Math.max(0, context.length - 3))),
                    { type: "text", role: "user", content: EXTRACT_ENTITY_COMPLETION(chunk) }
                ],
                (msg) => {
                    const [entities, relationships] = match(msg)
                    onUpdate?.(chunk, entities, relationships)
                },
                {
                    model: "long"
                }
            )
            const [entities, relationships] = match(result)
            context.push({ query: chunk, entities, relationships })
        } else {
            const chunk = chunks[i]
            const result = await ClientApi.chat(
                [
                    { type: "text", role: "system", content: EXTRACT_ENTITY_CHAT },
                    ...(context2msg(context).slice(Math.max(0, context.length - 5))),
                    { type: "text", role: "user", content: chunk }
                ],
                (msg) => {
                    const [entities, relationships] = match(msg)
                    onUpdate?.(chunk, entities, relationships)
                },
                {
                    model: "long"
                }
            )
            const [entities, relationships] = match(result)
            context.push({ query: chunk, entities, relationships })
        }
        i++
    }
    const entities = context.map(c => c.entities).flat()
    const relationships = context.map(c => c.relationships).flat()
    return { entities, relationships }
}