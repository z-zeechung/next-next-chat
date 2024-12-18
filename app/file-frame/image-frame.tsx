export function ImageFrame(props:{src:string}){
    return <div>
        <img src={props.src} width={"100%"} height={"100%"}/>
    </div>
}