export function wrapFunction(
    func:Function, 
    description?:{
        function?: string
        params?: {}
    }
){
    return {
        name: func.name,
        type: "object",
        description: description?.function??"",
        params: getFunctionParams(func).map(
            param=>{return {
                name: param,
                type: "string",
                description: description?.params?.[param]??""
            }}
        )
    }
}

function getFunctionParams(func:Function):string[] {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    return result || [];
}