import os
import sys
import io
from langchain import hub
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser # LLM이나 ChatModel에서 나오는 언어 모델의 출력을 문자열 형식으로 변환
from langchain_core.runnables import RunnablePassthrough # 데이터를 그대로 전달하는 역할, invoke 메서드를 통해 입력된 데이터를 그대로 반환
from langchain_core.prompts import PromptTemplate # OpenAI API를 사용하여 대화 모델 생성 사전 주문 및 생성
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import DirectoryLoader
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain_teddynote.messages import stream_response
from collections import Counter
from langchain.schema import Document  # Document 클래스 임포트

from dotenv import load_dotenv
load_dotenv()
os.getenv("OPENAI_API_KEY")

# 경로 추적을 위한 설정
os.environ["PWD"] = os.getcwd()

#출력의 인코딩을 utf-8로 설정한다
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

class UTF8TextLoader(TextLoader):
  def __init__(self, file_path: str):
    super().__init__(file_path, encoding="utf-8")


# 기본적으로 Python은 Windows에서 cp949 인코딩을 사용하지만, 한글 텍스트 파일이 UTF-8로 인코딩된 경우 이 문제가 발생할 수 있습니다.
loader = DirectoryLoader("./data", glob="*.txt", loader_cls=UTF8TextLoader)
documents = loader.load()
# print(len(documents))

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200) # 분할 토큰수(chunk), 오버랩 정도
texts = text_splitter.split_documents(documents)
# print(f"분할된 텍스트 뭉치의 갯수: {len(texts)}")

# 벡터스토어를 생성합니다.
vectorstore = FAISS.from_documents(documents=texts, embedding=OpenAIEmbeddings())
retriever = vectorstore.as_retriever()

prompt = PromptTemplate.from_template(
  """당신은 질문-답변(Question-Answering)을 수행하는 친절한 AI 어시스턴트입니다. 당신의 임무는 주어진 문맥(context) 에서 주어진 질문(question) 에 답하는 것입니다.
  색된 다음 문맥(context) 을 사용하여 질문(question) 에 답하세요. 만약, 주어진 문맥(context) 에서 답을 찾을 수 없다면, 답을 모른다면 `주어진 정보에서 질문에 대한 정보를 찾을 수 없습니다` 라고 답하세요. 한글로 답변해 주세요. 단, 기술적인 용어나 이름은 번역하지 않고 그대로 사용해 주세요. 답변은 3줄 이내로 요약해 주세요.
  
  #Question:
  {question}
  
  #Context:
  {context}
  
  #Answer:"""
)

llm = ChatOpenAI(model_name = "gpt-4o", temperature = 0)

# 체인을 생성합니다.
rag_chain = (
  {"context": retriever, "question": RunnablePassthrough()}
  | prompt
  | llm
  | StrOutputParser()
)

recieved_question = sys.argv[0]

answer = rag_chain.stream(recieved_question)
stream_response(answer)
