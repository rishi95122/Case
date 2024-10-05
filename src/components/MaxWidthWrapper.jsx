import React from 'react'

const MaxWidthWrapper = ({children,className}) => {
  return (
    <div className={`mx-auto w-full h-full max-w-screen-xl px-2.5 md:px-20 ${className}` }>
      {children}
    </div>
  )
}

export default MaxWidthWrapper