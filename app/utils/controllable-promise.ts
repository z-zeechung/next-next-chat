export class ControllablePromise<T> extends Promise<T>{
    
    // [Symbol.toStringTag]: string = "ControllablePromise";

    // then: <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) => Promise<TResult1 | TResult2>

    // catch: <TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined) => Promise<T | TResult>

    // finally: (onfinally?: (() => void) | null | undefined) => Promise<T>

    abortController: AbortController;
    
    constructor(cb:(
        resolve: (value: T | PromiseLike<T>) => void, 
        reject: (reason?: any) => void,
        abort: (value: T)=>boolean
    )=>void){

        super((resolve, reject)=>{
            cb(resolve, reject, (value: T)=>{
                if(this.abortController.signal.aborted){
                    resolve(value)
                    return true
                }
                return false
            })
        })

        this.abortController = new AbortController()

        // this.then = promise.then
        // this.catch = promise.catch
        // this.finally = promise.finally
    }

    abort(reason?: any){
        this.abortController.abort(reason)
    }
}