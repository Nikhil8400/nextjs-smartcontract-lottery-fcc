import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrace() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //pull out chainId from object and rename it to chainIdHex
    const chainId = parseInt(chainIdHex)
    let entranceFeeFromContract
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        entranceFeeFromContract = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromContract)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
            console.log(entranceFee)
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        try {
            await tx.wait(1)
            handleNewNotification(tx)
            updateUI()
        } catch (e) {}
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5 grid grid-flow-row auto-rows-max hover:auto-rows-min ">
           
<h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Feeling Lucky?</span> Scalable AI.</h1>
<p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Don't Press Your Luck, Just Press the Button – Join the Laughs!</p>
{raffleAddress ? (
                <div>
                    <br/>
                    <div> {isLoading || isFetching ? (
                            <svg
                                aria-hidden="true"
                                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                        ) : 
                        <button
                            className="mx-8 mt-7 mb-8 hover:bg-blue-700 text-white font-bold py-2 px-4 round bg-blue-500 text-white font-bold py-3 px-14 rounded-full"
                            onClick={async () => {
                                await enterRaffle({
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error), //onComplete onError
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >Enter Raffle</button>}
                    </div>
                    <div className=" font-serif text-xl">
                        Entrance Fee from contract is : $
                        {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </div>
                    <div className=" font-serif text-xl">Number of Players: {numPlayers}</div>
                    <div className=" font-serif text-xl">Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No raffle address is deteched</div>
            )}
        </div>
    )
}

//What we want in this function
//1) To have
