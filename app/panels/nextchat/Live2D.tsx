import { useEffect, useMemo, useRef, useState } from "react"
import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';
import React from "react";

window.PIXI = PIXI;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.append(script);
  });
}

let live2dModel: any = undefined
let app: any = undefined
let src = ""
let loadedScript = false

const canvas = document.createElement("canvas")
canvas.style.position = "fixed"
canvas.style.opacity = "0"
canvas.style.zIndex = "-100"
canvas.style.pointerEvents = "none"
document.body.appendChild(canvas)

/**
 * 
 * @param props.height
 *      根据人物自然身高及其与舞台的比例估算的舞台高度，单位为米
 * @param props.zoom
 *      画布的缩放比例，为1时画布高度等于`window.innerHeight`
 * @returns 
 *      高度为2米，宽度跟随比例的live2d舞台
 */
export function Live2D(props: { src, height, zoom }) {

  const ref = useRef(null)

  const [canvasWpH, setCanvasWpH] = useState(0.618)

  useEffect(() => {

    if (props.src != src) {
      src = props.src
      /* 此处存在内存泄露 */
      // if(app){app.destroy()}
      if (!src) { return }
      (async () => {
        if (!loadedScript) {
          loadedScript = true
          await loadScript("/live2d.min.js")
          await loadScript("/live2dcubismcore.min.js")
        }
        const Live2DModel = (await import('pixi-live2d-display')).Live2DModel
        live2dModel = await Live2DModel.from(src);
        const scale = window.innerHeight / live2dModel.height
        live2dModel.width *= scale
        live2dModel.height *= scale
        app = new PIXI.Application({
          view: canvas,
          backgroundAlpha: 0,
          width: live2dModel.width,
          height: live2dModel.height
        });
        app.stage.addChild(live2dModel);
      })()
    }

    if (!props.src) {
      return () => { }
    } else {
      canvas.style.opacity = "1"
      canvas.style.zIndex = "120"
      const checkCondition = () => {
        if (!live2dModel) {
          setTimeout(checkCondition, 50);
        } else {
          setCanvasWpH(live2dModel.width / live2dModel.height)
          if (ref.current) {
            const div = ref.current as HTMLDivElement
            const rect = div.getBoundingClientRect()
            const scale = (rect.height / live2dModel.height) * (props.height / 2)
            const naturalHeightFix = rect.height * (1 - props.height / 2)
            const naturalBodyWidthFix = rect.width * (1 - props.height / 2) / 2
            canvas.style.left = `${rect.left - (live2dModel.width * (1 - scale)) / 2 + naturalBodyWidthFix}px`
            canvas.style.top = `${rect.top - (live2dModel.height * (1 - scale)) / 2 + naturalHeightFix}px`
            canvas.style.scale = `${scale}`
          }
        }
      };
      checkCondition();

      return () => {
        canvas.style.opacity = "0"
        canvas.style.zIndex = "-100"
      }
    }
  })

  return <div ref={ref} style={{
    height: window.innerHeight * props.zoom,
    width: window.innerHeight * canvasWpH * props.zoom,
    pointerEvents: "none"
  }} />
}

export function motionLive2D(id) {
  live2dModel.motion(id);
}

export async function captureLive2DMotion(id):Promise<Blob> {
  return new Promise((resolve, reject) => {
    const stream = canvas.captureStream();
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: any[] = [];
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.push(event.data);
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob)
      }
    };
    mediaRecorder.start();
    live2dModel.motion(id);
    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  })
}