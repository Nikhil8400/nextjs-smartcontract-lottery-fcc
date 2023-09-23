import Head from "next/head"
// import ManulHeader  from "../components/ManualHeader"
import Header  from "../components/Header"
import LotteryEntrace from "../components/LotteryEntrance"

const index = () => {
    return (
        <div >
            <Head>
              <title>Smart Contract Lottery</title>
              <meta name = "description" content="Our Smart Contract Lottery"/>
              <link rel="icon" href="/favicon.ico"/>
            </Head>
            {/* <ManulHeader/> */}
            <Header/>
            <LotteryEntrace />
        </div>
    )
}

export default index
