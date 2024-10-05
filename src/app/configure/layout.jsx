import React from 'react'
import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Steps from '../../components/Steps'
const layout = ({children}) => {
  return (
    <MaxWidthWrapper>
      <Steps />
        {children}
    </MaxWidthWrapper>
  )
}

export default layout