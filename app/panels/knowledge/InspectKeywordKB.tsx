import { memo, useEffect, useRef, useState } from "react"
import type { GraphOptions } from '@antv/g6';
import { Graph as G6Graph } from '@antv/g6';

import { register, ExtensionCategory } from '@antv/g6';
import { Sphere, Line3D, Light, Plane } from '@antv/g6-extension-3d';
import { renderer } from '@antv/g6-extension-3d';
import { getInspectDataOfKB } from "@/app/knowledgebase/knowledgebase";

register(ExtensionCategory.NODE, 'sphere', Sphere);
register(ExtensionCategory.NODE, 'plane', Plane);
register(ExtensionCategory.EDGE, 'line3d', Line3D);
register(ExtensionCategory.PLUGIN, 'light', Light);


export const InspectKeywordKB = memo(InspectKeywordKB_);

function InspectKeywordKB_(props: { id }) {
    const [data, setData] = useState<any>({nodes:[], edges:[]});
    useEffect(() => {
        getInspectDataOfKB(props.id).then((data) => {
            setData(data);
        })
    }, [props.id])
    return <Graph options={{
        data: {
            nodes: data.nodes,
            edges: data.edges,
        },
        node: {
            style:{
                labelPlacement: 'center',
                labelText: d => d.id
            },
            palette: {
                type: 'group',
                field: 'cluster',
            },
        },
        layout: {
            type: 'd3-force',
            collide: {
              strength: 0.5,
            },
            link: {
                strength: edge=>Math.min(1, data.edges.find(e=>e.id===edge.id).score / 1000)
            }
        },
        behaviors: ['zoom-canvas', 'drag-canvas', { type: 'click-select', multiple: true, degree: 1, onClick:(e)=>{
            const q = e?.originalTarget?.attributes?.text
            if(q){
                // TODO
            }
        }}],
    }} />
}

export interface GraphProps {
    options: GraphOptions;
    onRender?: (graph: G6Graph) => void;
    onDestroy?: () => void;
}

export const Graph = (props: GraphProps) => {
    const { options, onRender, onDestroy } = props;
    const graphRef = useRef<G6Graph>();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const graph = new G6Graph({ container: containerRef.current! });
        graphRef.current = graph;

        return () => {
            const graph = graphRef.current;
            if (graph) {
                graph.destroy();
                onDestroy?.();
                graphRef.current = undefined;
            }
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const graph = graphRef.current;

        if (!options || !container || !graph || graph.destroyed) return;

        graph.setOptions(options);
        graph
            .render()
            .then(() => onRender?.(graph))
            // eslint-disable-next-line no-console
            .catch((error) => console.debug(error));
    }, [options]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};