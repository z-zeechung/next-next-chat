export function PdfFrame(props:{src:string}){
    return <div style={{
        width: "100%",
        height: "100%",
    }}>
        <iframe src={props.src} width={"100%"} height={"100%"}/>
    </div>
}