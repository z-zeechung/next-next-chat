import { showConfirm } from "../components/ui-lib";
import mammoth from 'mammoth'
import { parse } from 'pptxtojson'

export async function readTxt(f: File) {
    return await f.text()
}

export async function readHTML(f: File) {
    return await _readHTML(await f.text())
}

async function _readHTML(html: string) {

    html = removeUnwantedElements(html, {
        onlyMainContent: true,
        includeHtml: false,
        includeRawHtml: false,
        waitFor: 0,
        screenshot: false,
        fullPageScreenshot: false,
        headers: undefined,
    })??""

    var TurndownService = require("turndown/lib/turndown.browser.umd");
    var turndownPluginGfm = require('joplin-turndown-plugin-gfm')

    const turndownService = new TurndownService();
    turndownService.addRule("inlineLink", {
      filter: function (node, options) {
        return (
          options.linkStyle === "inlined" &&
          node.nodeName === "A" &&
          node.getAttribute("href")
        );
      },
      replacement: function (content, node) {
        var href = node.getAttribute("href").trim();
        var title = node.title ? ' "' + node.title + '"' : "";
        return "[" + content.trim() + "](" + href + title + ")\n";
      },
    });
    var gfm = turndownPluginGfm.gfm;
    turndownService.use(gfm);
    let markdownContent = turndownService.turndown(html);
  
    // multiple line links
    let insideLinkContent = false;
    let newMarkdownContent = "";
    let linkOpenCount = 0;
    for (let i = 0; i < markdownContent.length; i++) {
      const char = markdownContent[i];
  
      if (char == "[") {
        linkOpenCount++;
      } else if (char == "]") {
        linkOpenCount = Math.max(0, linkOpenCount - 1);
      }
      insideLinkContent = linkOpenCount > 0;
  
      if (insideLinkContent && char == "\n") {
        newMarkdownContent += "\\" + "\n";
      } else {
        newMarkdownContent += char;
      }
    }
    markdownContent = newMarkdownContent;
  
    // Remove [Skip to Content](#page) and [Skip to content](#skip)
    markdownContent = markdownContent.replace(
      /\[Skip to Content\]\(#[^\)]*\)/gi,
      ""
    );

    // markdownContent = markdownContent.replace(/\!\[(.*?)\]\(.*?\)/g, " image:[$1] ")

    // markdownContent = markdownContent.replace(/\[(.*?)\]\(.*?\)/g, " href:[$1] ")

    return markdownContent;
}

export async function readPDF(file: File):Promise<string> {
    const pdfjsLib = require("pdfjs-dist/build/pdf.mjs")
    const workerURL = (worker) => document.location.origin + document.location.pathname.split('/').slice(0, -1).join('/') + '/' + worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerURL("pdf.worker.min.mjs")

    let ret = ""

    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = async function (e: any) {
            const typedarray = new Uint8Array(e.target.result);
            const pdfDoc = await pdfjsLib.getDocument({ data: typedarray }).promise
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                var page = await pdfDoc.getPage(i)
                for (let item of (await page.getTextContent()).items) {
                    ret += item.str
                    if (item.hasEOL) {
                        ret += "\n"
                    }
                }
            };
            resolve(ret)
        }
        fileReader.readAsArrayBuffer(file);
    })
}

export async function readDocx(file: File):Promise<string> {
    const result = await mammoth.convertToHtml({
        arrayBuffer: await file.arrayBuffer()
    })
    return _readHTML(result.value)
}

export async function readDoc(file: File):Promise<string> {
    if (file.name.endsWith(".doc")) {
        const antiword = require("../../private_modules/antiword-master/antiword.patched")
        return new Promise((resolve)=>{
            const fileReader = new FileReader();
            fileReader.onload = async function (e: any) {
                const typedarray = new Uint8Array(e.target.result);
                await antiword({doc: typedarray, resolve:resolve})
            }
            fileReader.readAsArrayBuffer(file);
        })
    } else {
        const JSZip = require("jszip/dist/jszip.js")
        const zip = await JSZip.loadAsync(file)
        let xml:string = await zip.file("word/document.xml").async('text')
        function parseXML(xmlString) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(xmlString, "text/xml");
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                console.error("Error parsing XML string");
                return null;
            }
            return xmlDoc;
        }
        const src = parseXML(xml)
        let ret = ""
        function parse(src:Node){
            for(let child of src.childNodes){
                if(child.nodeName=="#text"){
                    ret += child.textContent??""
                }else{
                    parse(child)
                    if(child.nodeName=="w:p"){
                        ret+="\n"
                    }
                }
            }
        }
        parse(src as any)
        return ret
    }
}

export async function readPPTx(file: File):Promise<string> {
    const json = await parse(await file.arrayBuffer())
    let ret = "<html>"
    for(let slide of json.slides){
        ret += "<div>"
        for(let e of slide.elements){
            ret += (e as any).content??`<image src="${(e as any).src}"/>`??""
        }
        ret += "</div>"
    }
    ret += "</html>"
    ret = await _readHTML(ret)
    return ret
}















/**************************************************
 * 
 * CLEAN HTML
 * 
 **************************************************/

import * as cheerio from 'cheerio';

export type PageOptions = {
    onlyMainContent?: boolean;
    includeHtml?: boolean;
    includeRawHtml?: boolean;
    fallback?: boolean;
    fetchPageContent?: boolean;
    waitFor?: number;
    screenshot?: boolean;
    fullPageScreenshot?: boolean;
    headers?: Record<string, string>;
    replaceAllPathsWithAbsolutePaths?: boolean;
    parsePDF?: boolean;
    removeTags?: string | string[];
    onlyIncludeTags?: string | string[];
};

export const removeUnwantedElements = (
    html: string,
    pageOptions: PageOptions
) => {
    const soup = cheerio.load(html);

    if (
        pageOptions.onlyIncludeTags &&
        pageOptions.onlyIncludeTags.length > 0 &&
        pageOptions.onlyIncludeTags[0] !== ''
    ) {
        if (typeof pageOptions.onlyIncludeTags === "string") {
            pageOptions.onlyIncludeTags = [pageOptions.onlyIncludeTags];
        }
        if (pageOptions.onlyIncludeTags.length !== 0) {
            // Create a new root element to hold the tags to keep
            const newRoot = cheerio.load("<div></div>")("div");
            pageOptions.onlyIncludeTags.forEach((tag) => {
                soup(tag).each((index, element) => {
                    newRoot.append(soup(element).clone());
                });
            });
            return newRoot.html();
        }
    }

    soup("script, style, iframe, noscript, meta, head").remove();

    if (
        pageOptions.removeTags &&
        pageOptions.removeTags.length > 0 &&
        pageOptions.removeTags[0] !== ''
    ) {
        if (typeof pageOptions.removeTags === "string") {
            pageOptions.removeTags = [pageOptions.removeTags];
        }

        if (Array.isArray(pageOptions.removeTags)) {
            pageOptions.removeTags.forEach((tag) => {
                let elementsToRemove: any;
                if (tag.startsWith("*") && tag.endsWith("*")) {
                    let classMatch = false;

                    const regexPattern = new RegExp(tag.slice(1, -1), "i");
                    elementsToRemove = soup("*").filter((i, element) => {
                        if (element.type === "tag") {
                            const attributes = element.attribs;
                            const tagNameMatches = regexPattern.test(element.name);
                            const attributesMatch = Object.keys(attributes).some((attr) =>
                                regexPattern.test(`${attr}="${attributes[attr]}"`)
                            );
                            if (tag.startsWith("*.")) {
                                classMatch = Object.keys(attributes).some((attr) =>
                                    regexPattern.test(`class="${attributes[attr]}"`)
                                );
                            }
                            return tagNameMatches || attributesMatch || classMatch;
                        }
                        return false;
                    });
                } else {
                    elementsToRemove = soup(tag);
                }
                elementsToRemove.remove();
            });
        }
    }

    if (pageOptions.onlyMainContent) {
        excludeNonMainTags.forEach((tag) => {
            const elementsToRemove = soup(tag);
            elementsToRemove.remove();
        });
    }
    const cleanedHtml = soup.html();
    return cleanedHtml;
};

const excludeNonMainTags = [
    "header",
    "footer",
    "nav",
    "aside",
    ".header",
    ".top",
    ".navbar",
    "#header",
    ".footer",
    ".bottom",
    "#footer",
    ".sidebar",
    ".side",
    ".aside",
    "#sidebar",
    ".modal",
    ".popup",
    "#modal",
    ".overlay",
    ".ad",
    ".ads",
    ".advert",
    "#ad",
    ".lang-selector",
    ".language",
    "#language-selector",
    ".social",
    ".social-media",
    ".social-links",
    "#social",
    ".menu",
    ".navigation",
    "#nav",
    ".breadcrumbs",
    "#breadcrumbs",
    "#search-form",
    ".search",
    "#search",
    ".share",
    "#share",
    ".pagination",
    "#pagination",
    ".widget",
    "#widget",
    ".related",
    "#related",
    ".tag",
    "#tag",
    ".category",
    "#category",
    ".cookie",
    "#cookie"
];
