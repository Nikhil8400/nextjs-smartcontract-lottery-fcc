import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManulHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis()
    useEffect(() => {
        if (isWeb3Enabled) return
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem("connected")){
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(()=>{
        Moralis.onAccountChanged((account)=>{
            console.log(`Account change to ${account}`)
            if(account == null){
                window.localStorage.removeItem("connected")
                deactivateWeb3
                console.log("Null account found")
            }
        })
    },[])

    return (
        <div>
            {account ? (
                <p>
                    Connected to {account.slice(0, 4)}......{account.slice(account.length - 4)}
                </p>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if(typeof window !== "undefined"){
                        window.localStorage.setItem("connected", "injected")}
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}