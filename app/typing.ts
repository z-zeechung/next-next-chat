import { ChatCompletionTool } from "openai/resources";
import { Message } from "./message/Message";
import { ControllablePromise } from "./utils/controllable-promise";

export type Updater<T> = (updater: (value: T) => void) => void;

export const ROLES = ["system", "user", "assistant", "tool"] as const;
export type MessageRole = (typeof ROLES)[number];

export type Tool = ChatCompletionTool & {
    call?: (params: any) => Promise<string>
}

export type JsonSchema = {
    title: string
    type: "object"
    description?: string
    properties?: {
        [key: string]: (
            | NumberProperty
            | StringProperty
            | BooleanProperty
            | ObjectProperty
            | ArrayProperty
        ) & {
            description?: string
        }
    },
    required?: string[]
}

type NumberProperty = {
    type: "number"
    default?: number
    minimum?: number
    maximum?: number
    exclusiveMinimum?: boolean
    exclusiveMaximum?: boolean
    multipleOf?: number
    enum?: number[]
}

type StringProperty = {
    type: "string"
    default?: string
    minLength?: number
    maxLength?: number
    pattern?: string
    enum?: string[]
}

type BooleanProperty = {
    type: "boolean"
    default?: boolean
}

type ObjectProperty = {
    type: "object";
    default?: any;
} & Omit<JsonSchema, "title" | "type">;

type ArrayProperty = {
    type: "array"
    default?: any[]
    items: JsonSchema
    minItems?: number
    maxItems?: number
    uniqueItems?: boolean
}