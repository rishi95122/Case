"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
const STEPS = [
    {
      name: 'Step 1: Add image',
      description: 'Choose an image for your case',
      url: '/upload',
    },
    {
      name: 'Step 2: Customize design',
      description: 'Make the case yours',
      url: '/design',
    },
    {
      name: 'Step 3: Summary',
      description: 'Review your final design',
      url: '/preview',
    },
  ]
const Steps = () => {
    const pathname = usePathname()
  return (
    <div className='bg-white flex pb-10 max-xl:flex-col gap-5'>
        {
                STEPS.map((step,idx)=>{
                    const isCurrent = pathname.endsWith(step.url)
                    const imgPath = `/snake-${idx + 1}.png`

                    return (
                        <li key={idx} className={`flex  p-5 items-center gap-5 ${idx!==0 && `xl:border-l-4`}`}>
                            <img src={imgPath} alt="" className='w-16'/>
                            <div>
                                <p>{step.name}</p>
                                <p>{step.description}</p>
                            </div>
                        </li>
                    )
                })
        }
    </div>
  )
}

export default Steps