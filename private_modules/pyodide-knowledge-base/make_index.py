COMMAND = "query" # new, insert, list, delete, query

INDEX = "vector"  # vector, rake, knowledge_graph, property_graph, tree

def INSTALL_PACKAGES(target = "global"): # global, vector, rake, knowledge_graph, property_graph, tree
    ...

def COUNT_TOKENS(text: str) -> int:
    return len(text)

def CHAT(messages, on_update=None):
    return "(this, is, a test)"

from typing import Callable, Dict, List, Optional
def EMBED(text: str) -> List[float]:
    return [0.0] * 256

def ON_UPDATE(info:str, progress:float):
    print(f"{progress*100:.2f}% {info}")

INPUT_FILE_DIR = ""

PERSIT_DIR = ""

MODEL_NAME = "NNCHAT-Regular"

CONTEXT_WINDOW = 4096

TO_DELETE = []

QUERY_QUESTION = "aaaaaaaaaai"




LOADING_PKGS = "正在加载组件"
IMPORTING_MODULES = "正在配置组件"
LOADING_FILES = "正在准备文件"
EXPORTING_INDEX = "保存中"
def PROCESS_FILE(i):
    return f'正在处理...'

ON_UPDATE(LOADING_PKGS, 0.05)
INSTALL_PACKAGES()


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
from llama_index.core import SimpleDirectoryReader, Settings
from llama_index.core.base.embeddings.base import BaseEmbedding, Embedding, mean_agg
from llama_index.core.llms import LLM, ChatMessage, ChatResponse, CompletionResponse, ChatResponseAsyncGen, CompletionResponseAsyncGen, LLMMetadata, ChatResponseGen, CompletionResponseGen, MessageRole

if INDEX == "vector":
    INSTALL_PACKAGES("vector")
    from llama_index.core import VectorStoreIndex
    Index = VectorStoreIndex
elif INDEX == "rake":
    INSTALL_PACKAGES("rake")
    # 回头别忘把这东西的分词器改了
    from llama_index.core import RAKEKeywordTableIndex
    Index = RAKEKeywordTableIndex
elif INDEX == "knowledge_graph":
    INSTALL_PACKAGES("knowledge_graph")
    from llama_index.core import KnowledgeGraphIndex
    Index = KnowledgeGraphIndex
elif INDEX == "property_graph":
    INSTALL_PACKAGES("property_graph")
    from llama_index.core.graph_stores.simple_labelled import SimplePropertyGraphStore
    import fsspec
    def persist(
        self, persist_path: str, fs: Optional[fsspec.AbstractFileSystem] = None
    ) -> None:
        """Persist the graph store to a file."""
        if fs is None:
            fs = fsspec.filesystem("file")
        # with fs.open(persist_path, "w") as f:
        with fs.open(persist_path, "w", encoding="utf-8") as f:
            f.write(self.graph.model_dump_json())
    SimplePropertyGraphStore.persist = persist
    from llama_index.core import PropertyGraphIndex
    Index = PropertyGraphIndex
elif INDEX == "tree":
    INSTALL_PACKAGES("tree")
    from llama_index.core import TreeIndex
    Index = TreeIndex

class NNLLM(LLM):
    async def achat(
        self, messages: Sequence[ChatMessage], **kwargs: Any
    ) -> ChatResponse:
        return self.chat(messages)
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
        return ChatResponse(
            message=ChatMessage(
                role=MessageRole.USER,
                content=CHAT([{"role": m.role, "content": m.content} for m in messages]),
            )
        )
    def complete(
        self, prompt: str, formatted: bool = False, **kwargs: Any
    ) -> CompletionResponse:
        ...
    @property
    def metadata(self) -> LLMMetadata:
        return LLMMetadata(
            context_window=CONTEXT_WINDOW,
            num_output=CONTEXT_WINDOW,
            is_chat_model=True,
            is_function_calling_model=False,
            model_name=MODEL_NAME,
            system_role="system"
        )
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

if COMMAND == "new":

    ON_UPDATE(LOADING_FILES, 0.1)
    documents = SimpleDirectoryReader(INPUT_FILE_DIR).load_data()

    inc = 0.85 / len(documents)
    ON_UPDATE(PROCESS_FILE(1), 0.1+inc)
    index = Index.from_documents([documents[0]])
    for idx, document in enumerate(documents[1:]):
        ON_UPDATE(PROCESS_FILE(idx+2), 0.1+inc*(idx+2))
        index.insert(document)

    ON_UPDATE(EXPORTING_INDEX, 0.97)
    index.storage_context.persist(persist_dir=PERSIT_DIR)

elif COMMAND == "insert":
    from llama_index.core import StorageContext, load_index_from_storage
    index = load_index_from_storage(StorageContext.from_defaults(persist_dir=PERSIT_DIR))

    ON_UPDATE(LOADING_FILES, 0.1)
    documents = SimpleDirectoryReader(INPUT_FILE_DIR).load_data()

    inc = 0.85 / len(documents)
    ON_UPDATE(PROCESS_FILE(1), 0.1+inc)
    index.insert(documents[0])
    for idx, document in enumerate(documents[1:]):
        ON_UPDATE(PROCESS_FILE(idx+2), 0.1+inc*(idx+2))
        index.insert(document)

    ON_UPDATE(EXPORTING_INDEX, 0.97)
    index.storage_context.persist(persist_dir=PERSIT_DIR)

elif COMMAND == "list":
    from llama_index.core import StorageContext, load_index_from_storage
    index = load_index_from_storage(StorageContext.from_defaults(persist_dir=PERSIT_DIR))
    content = {}
    for i in index.docstore.docs.values():
        file_name = i.metadata['file_name']
        id = i.id_
        text = i.text
        if(file_name not in content):
            content[file_name] = text
        else:
            content[file_name] += text

    print(content.keys())

    DOCUMENTS_LIST = content

elif COMMAND == "delete":
    # 删不掉，啊米诺斯
    from llama_index.core import StorageContext, load_index_from_storage
    index = load_index_from_storage(StorageContext.from_defaults(persist_dir=PERSIT_DIR))
    contents = {id:index.ref_doc_info[id].metadata['file_name'] for id in index.ref_doc_info}
    for c in contents:
        if contents[c] in TO_DELETE:
            index.delete(c)

    ON_UPDATE(EXPORTING_INDEX, 0.97)
    index.storage_context.persist(persist_dir=PERSIT_DIR)

elif COMMAND == "query":
    from llama_index.core import StorageContext, load_index_from_storage
    index = load_index_from_storage(StorageContext.from_defaults(persist_dir=PERSIT_DIR))
    result = index.as_retriever().retrieve(QUERY_QUESTION)
    content = {i.text:i.metadata['file_name'] for i in result}
    print(content)
    QUERY_RESULTS = content