export async function initPyodide(setPyodide){
    await importScripts('/pyodide/pyodide/pyodide.js');
    const pyodide = await loadPyodide()
    const tgz = new Uint8Array(await (await (await fetch("/pyodide/pyodide-packages.tar.gz")).blob()).arrayBuffer())
    pyodide.FS.writeFile("/pyodide-packages.tar.gz", tgz)
    await pyodide.runPythonAsync(`
        import tarfile
        import os
        with tarfile.open('/pyodide-packages.tar.gz', 'r:gz') as tar:
            tar.extractall(path='/')
    `)
    await pyodide.FS.writeFile("/home/pyodide/fcntl.py", `
fcntl = None
F_GETFL = None
F_SETFL = None
    `, { encoding: "utf8" });
    await pyodide.FS.writeFile("/home/pyodide/zstandard.py", `
ZstdCompressor = None
    `, { encoding: "utf8" });
        await fakeFaiss(pyodide)
    await pyodide.runPythonAsync(`
import pymongo
import mongomock
pymongo.MongoClient = mongomock.MongoClient

import redis, fakeredis
from fakeredis import FakeStrictRedis
FakeStrictRedis(monkeypatch=True)
redis.Redis = fakeredis.FakeRedis
    `)
    await pyodide.runPythonAsync(`
import langchain_openai.embeddings.base
def embed_documents(
    self, texts, chunk_size=None
) :
    # chunk_size_ = chunk_size or self.chunk_size
    return [[0.0]*768]*len(texts)
langchain_openai.embeddings.base.OpenAIEmbeddings.embed_documents = embed_documents    
    `)
    setPyodide(pyodide)
}

async function fakeFaiss(pyodide){
    await pyodide.FS.writeFile("/home/pyodide/faiss.py", `
import numpy as np

class FakeFaissIndex:
    def __init__(self, d):
        """
        创建一个假的faiss索引
        :param d: 向量维度
        """
        self.d = d
        self.vectors = []  # 存储向量的列表
        self.index = []    # 存储索引的列表
    
    def add(self, x):
        """
        添加向量到索引
        :param x: numpy数组，形状为(n, d)
        """
        n = x.shape[0]
        # 生成连续的索引ID
        start_id = len(self.index)
        self.index.extend(range(start_id, start_id + n))
        self.vectors.append(x.copy())
    
    def search(self, x, k):
        """
        搜索最近的k个邻居
        :param x: 查询向量，numpy数组，形状为(m, d)
        :param k: 需要返回的最近邻数量
        :return: (distances, indices)
        """
        if len(self.vectors) == 0:
            return np.empty((x.shape[0], k)), np.empty((x.shape[0], k), dtype=int)
        
        # 拼接所有存储的向量
        all_vectors = np.concatenate(self.vectors, axis=0)
        all_indices = np.array(self.index)
        
        # 计算L2距离
        distances = np.linalg.norm(all_vectors[:, np.newaxis] - x, axis=2)
        distances = distances.T
        
        # 获取最近的k个索引
        sorted_indices = np.argsort(distances, axis=1)[:, :k]
        
        # 收集结果
        result_indices = all_indices[sorted_indices]
        result_distances = np.take_along_axis(distances, sorted_indices, axis=1)
        
        return result_distances.astype(np.float32), result_indices

Index = FakeFaissIndex

def read_index(*args):
    return FakeFaissIndex(128)
    `, { encoding: "utf8" });
}