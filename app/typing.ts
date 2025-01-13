import { ChatCompletionTool } from "openai/resources";
import { Message } from "./message/Message";
import { ControllablePromise } from "./utils/controllable-promise";

export type Updater<T> = (updater: (value: T) => void) => void;

export const ROLES = ["system", "user", "assistant", "tool"] as const;
export type MessageRole = (typeof ROLES)[number];

export type Tool = ChatCompletionTool & {call?:(params:object)=>Promise<string>}