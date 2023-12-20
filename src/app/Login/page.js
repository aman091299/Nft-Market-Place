import dynamic from 'next/dynamic'
import React from 'react'

const DynamicConnectWallet=dynamic(()=>import("./Connect"),
{
  ssr:false,
  loading:()=><p>Loading....</p>
}
)
const page = () => {
  return (
    <div><DynamicConnectWallet/></div>
  )
}

export default page