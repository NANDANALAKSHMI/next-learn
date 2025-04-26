import Image from 'next/image'
import React from 'react'

const Banner = () => {
    return (
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-slate-800">

            <div className="flex justify-center w-full">
                <Image
                    src="/login.svg"
                    width={500}
                    height={800}
                    alt="Learning illustration"
                    className="w-full max-w-xs"
                />
            </div>
        </div>
    )
}

export default Banner