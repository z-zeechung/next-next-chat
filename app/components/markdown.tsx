import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import rehypeRaw from 'rehype-raw'
import { useRef, useState, RefObject, useEffect, useMemo } from "react";
import { copyToClipboard, useWindowSize } from "../utils";
import mermaid from "mermaid";

import LoadingIcon from "../icons/three-dots.svg";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { showImageModal } from "./ui-lib";
import { renderToString } from "react-dom/server";
import { ThoughtChain } from "@ant-design/x";
import { CheckOutlined, CopyOutlined, DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Collapse, Flex, message, Modal } from "antd";
// import { DownloadIcon } from "@chakra-ui/icons";

export function Mermaid(props: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error("[Mermaid] ", e.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.code]);

  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const text = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([text], { type: "image/svg+xml" });
    showImageModal(URL.createObjectURL(blob));
  }

  if (hasError) {
    return null;
  }

  return <div>
    <div
      // className="no-dark mermaid"
      style={{
        // cursor: "pointer",
        overflow: "auto",
        display:"inline-block"
      }}
      ref={ref}
      // onClick={() => viewSvgInNewWindow()}
    >
      {props.code}
    </div>
    <Flex gap={"small"}>
      <Button icon={<DownloadOutlined />} color="default" variant="filled" size="small" shape="round" onClick={async ()=>{
        const svg = ref.current?.querySelector("svg");
        if (!svg) return;
        const canvas = document.createElement('canvas');
        const img = document.getElementById('outputImage');

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        function blobToDataURL(blob, type): Promise<string> {
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                  resolve(reader.result as string);
              };
              reader.onerror = () => {
                  reject(reader.error);
              };
              reader.readAsDataURL(new File([blob], "", { type }));
          });
        }
        const url = await blobToDataURL(svgBlob, 'image/svg+xml;charset=utf-8');
        const imgElement = new Image();
        imgElement.onload = function() {
            canvas.width = svg.width.baseVal.value;
            canvas.height = svg.height.baseVal.value;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(imgElement, 0, 0);
            const pngDataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngDataUrl;
            a.download = 'image.png';
            a.click();
            URL.revokeObjectURL(url); // 释放内存
        };
        imgElement.src = url;
      }}>下载图片</Button>
      <Button icon={<CopyOutlined />} color="default" variant="filled" size="small" shape="round" onClick={()=>{
        navigator.clipboard.writeText(props.code)
        message.success("已复制Mermaid代码到剪贴板")
      }}>复制代码</Button>
    </Flex>
  </div>
}

function ToolCall(props:{code}){
  try{
    return <ThoughtChain items={JSON.parse(props.code).map(o=>{return {
      title: o["title"],
      content: o["content"]?<div style={{all:"initial"}}><Markdown content={o["content"]}/></div>:undefined,
      status: o["status"],
      icon: {success: <CheckOutlined />, pending: <LoadingOutlined />}[o["status"]],
      description: o["description"]?o["description"]:undefined
    }})}/>
  }catch(e){
    return <></>
  }
}

function Code(props: {children, className?}){
  if(props.className == "hljs language-mermaid"){
    return <Mermaid code={props.children}/>
  }else if(props.className == "hljs language-toolcall"){
    return <ToolCall code={props.children}/>
  }else if(props.className == "hljs language-think"){
    return <div style={{all:"initial"}}>
      <Collapse style={{fontSize:"0.8em"}} size="small" bordered={false} defaultActiveKey={['1']} items={[{
        key: '1',
        label: "深度思考",
        children: props.children
      }]}/>
    </div>
  }
  try{
    if(props?.children?.[0]?.includes("\n")) {return <code className={props.className??"hljs"}>{props.children}</code>}
  }catch{}
  return <code className={props.className}>{props.children}</code>
}

export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null);
  const refText = ref.current?.innerText;
  const [mermaidCode, setMermaidCode] = useState("");

  const renderMermaid = useDebouncedCallback(() => {
    if (!ref.current) return;
    const mermaidDom = ref.current.querySelector("code.language-mermaid");
    if (mermaidDom) {
      setMermaidCode((mermaidDom as HTMLElement).innerText);
    }
  }, 600);

  useEffect(() => {
    setTimeout(renderMermaid, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refText]);

  return (
    <>
      {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )}
      <pre ref={ref}>
        <span
          className="copy-code-button"
          onClick={() => {
            if (ref.current) {
              const code = ref.current.innerText;
              copyToClipboard(code);
            }
          }}
        ></span>
        {props.children}
      </pre>
    </>
  );
}

function escapeDollarNumber(text: string) {
  let escapedText = "";

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i];
    const nextChar = text[i + 1] || " ";

    if (char === "$" && nextChar >= "0" && nextChar <= "9") {
      char = "\\$";
    }

    escapedText += char;
  }

  return escapedText;
}

function escapeBrackets(text: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock;
      } else if (squareBracket) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
}

function MarkDownContent_(props: { content: string }) {
  const escapedContent = useMemo(() => {
    return escapeBrackets(escapeDollarNumber(props.content));
  }, [props.content]);
  
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        rehypeRaw as any,
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        // pre: PreCode,
        pre: (props: {children})=><pre style={{background:"#0000"}}>{props.children}</pre>,
        code: Code,
        p: (pProps) => <p {...pProps} dir="auto" />,
        a: (aProps) => {
          const href = aProps.href || "";
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} />;
        },
        img: (props:{src?})=>{
          return <div style={{display:"flex", flexDirection:"column", gap: 8}}>
            <div style={{ borderRadius: 16, maxWidth: "50%", pointerEvents: "none", userSelect: "none", overflow: "hidden", background: "white" }}>
              <img src={props.src}/>
            </div>
            <Flex gap={"small"}>
              {/* <Button color="default" variant="filled" size="small" onClick={()=>{
                Modal.confirm({
                  title: "查看图片",
                  icon: <></>,
                  content: <img src={props.src} style={{zoom:2}}/>
                })
              }}>查看</Button> */}
              <Button icon={<DownloadOutlined/>} shape="round" color="default" variant="filled" size="small" onClick={async ()=>{
                const arr = await (await fetch(props.src)).arrayBuffer()
                const blob = new Blob([arr])
                function blobToDataURL(blob): Promise<string> {
                  return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                          resolve(reader.result as string);
                      };
                      reader.onerror = () => {
                          reject(reader.error);
                      };
                      reader.readAsDataURL(new File([blob], ""));
                  });
                }
                let suffix = "png"
                if(arr[0]==0x89 && arr[1]==0x50){
                  suffix = "png"
                }else if(arr[0]==0xff && arr[1]==0xd8){
                  suffix = "jpg"
                }else if(arr[0]==0x52 && arr[1]==0x49 && arr[2]==0x46 && arr[3]==0x46){
                  suffix="webp"
                }else if(arr[0]==0x42&&arr[1]==0x4d){
                  suffix="bmp"
                }
                const url = await blobToDataURL(blob)
                const a = document.createElement("a");
                a.href = url;
                a.download = "image."+suffix;
                a.click();
                a.remove();
              }}>下载</Button>
            </Flex>
          </div>
        }
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(MarkDownContent_);

export function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
        color:"inherit"
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      dir="auto"
    >
      {props.loading ? (
        <LoadingIcon />
      ) : (
        <MarkdownContent content={props.content} />
      )}
    </div>
  );
}
