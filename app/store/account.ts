import { createPersistStore } from "../utils/store";

export const useAccount = createPersistStore(
    {
        loginStatus: false
    },
    (set, get)=>({
        setLoginStatus(status:boolean){
            set(()=>({
                loginStatus: status
            }))
        }
    }),
    {
        name: "nnchat-account-login-status"
    }
)