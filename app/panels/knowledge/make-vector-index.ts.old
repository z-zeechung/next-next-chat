import { runPyodide } from "@/app/utils/pyodide"
import { estimateTokenLength } from "@/app/utils/token";
import { nanoid } from "nanoid";
import { readFile } from "./read-file";

export async function makeVectorIndex(files:File[], onUpdate: (info: string, progress: number) => void){
    const tmpid = nanoid()
    const output_tmpid = nanoid()
    await runPyodide(async pyodide=>{
        pyodide.FS.mkdirTree(`/tmp/${tmpid}`);
        for(let file of files){
            const file_name = file.name
            const content = await readFile(file)
            pyodide.FS.writeFile(`/tmp/${tmpid}/${file_name}.txt`, content, { encoding: "utf8" });
        }
        pyodide.globals.set("tmpid", tmpid);
        pyodide.globals.set("estimateTokenLength", estimateTokenLength);
        pyodide.globals.set("onUpdate", onUpdate);
        pyodide.FS.mkdirTree(`/${output_tmpid}`);
        pyodide.FS.mount(pyodide.FS.filesystems.IDBFS, {}, `/${output_tmpid}`);
        pyodide.globals.set("output_tmpid", output_tmpid);
        await pyodide.runPythonAsync(CODE)
        await pyodide.FS.syncfs(false, function (err) {});
    })
    return output_tmpid
}


const CODE = `

async def INSTALL_PACKAGES():
    import micropip
    await micropip.install("sqlite3")
    micropip.add_mock_package("jiter", "0.4.0")
    micropip.add_mock_package("tiktoken", "0.3.3")
    await micropip.install("llama-index-core")
    await micropip.install("llama-index-readers-file")
    import sys
    sys.modules['_multiprocessing'] = object

def COUNT_TOKENS(text: str) -> int:
    return int(estimateTokenLength(text)) + 1

from typing import List
def EMBED(text: List[str]) -> List[float]:
    return ([0.0] * 256) * len(text)

def ON_UPDATE(info:str, progress:float):
    onUpdate(info, progress)

INPUT_FILE_DIR = f'/tmp/{tmpid}'

PERSIT_DIR = f"/{output_tmpid}"


LOADING_PKGS = "正在加载组件"
IMPORTING_MODULES = "正在配置组件"
LOADING_FILES = "正在准备文件"
EXPORTING_INDEX = "保存中"
def PROCESS_FILE(i):
    return f'正在处理第 {i} 篇文档'

ON_UPDATE(LOADING_PKGS, 0.05)
await INSTALL_PACKAGES()


ON_UPDATE(IMPORTING_MODULES, 0.07)

import sys
class PseudoTiktoken():
    class Encoding:
        def encode(self, text: str, allowed_special, visualise: str | None = "colour") -> list[int]:
            return [0o721] * COUNT_TOKENS(text)
    def encoding_for_model(self, model_name: str) -> Encoding:
        return self.Encoding()
sys.modules['tiktoken'] = PseudoTiktoken()

from typing import Any, Sequence
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Settings
from llama_index.core.base.embeddings.base import BaseEmbedding, Embedding, mean_agg
from llama_index.core.llms import LLM, ChatMessage, ChatResponse, CompletionResponse, ChatResponseAsyncGen, CompletionResponseAsyncGen, LLMMetadata, ChatResponseGen, CompletionResponseGen, MessageRole

class NNLLM(LLM):
    async def achat(
        self, messages: Sequence[ChatMessage], **kwargs: Any
    ) -> ChatResponse:
        ...
    async def acomplete(
        self, prompt: str, formatted: bool = False, **kwargs: Any
    ) -> CompletionResponse:
        ...
    async def astream_chat(
        self, messages: Sequence[ChatMessage], **kwargs: Any
    ) -> ChatResponseAsyncGen:
        ...
    async def astream_complete(
        self, prompt: str, formatted: bool = False, **kwargs: Any
    ) -> CompletionResponseAsyncGen:
        ...
    def chat(self, messages: Sequence[ChatMessage], **kwargs: Any) -> ChatResponse:
        ...
    def complete(
        self, prompt: str, formatted: bool = False, **kwargs: Any
    ) -> CompletionResponse:
        ...
    def metadata(self) -> LLMMetadata:
        ...
    def stream_chat(
        self, messages: Sequence[ChatMessage], **kwargs: Any
    ) -> ChatResponseGen:
        ...
    def stream_complete(
        self, prompt: str, formatted: bool = False, **kwargs: Any
    ) -> CompletionResponseGen:
        ...

class NNEmbedding(BaseEmbedding):
    def _get_query_embedding(self, query: str) -> Embedding:
        return EMBED(query)
    def _get_text_embedding(self, text: str) -> Embedding:
        return EMBED(text)
    async def _aget_query_embedding(self, query: str) -> Embedding:
        return EMBED(query)


Settings.embed_model = NNEmbedding()

Settings.llm = NNLLM()

ON_UPDATE(LOADING_FILES, 0.1)
documents = SimpleDirectoryReader(INPUT_FILE_DIR).load_data()

inc = 0.85 / len(documents)
ON_UPDATE(PROCESS_FILE(1), 0.1+inc)
index = VectorStoreIndex.from_documents([documents[0]])
for idx, document in enumerate(documents[1:]):
    ON_UPDATE(PROCESS_FILE(idx+2), 0.1+inc*(idx+2))
    index.insert(document)

ON_UPDATE(EXPORTING_INDEX, 0.97)
index.storage_context.persist(persist_dir=PERSIT_DIR)
`