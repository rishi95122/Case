import imageSchema from '@/utils/schema'
import React from 'react'
import DesignConfigurator from './DesignConfigurator'
const Design =async ({searchParams}) => {
  const { id } = searchParams

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await imageSchema.findById(id)

  if (!configuration) {
    return notFound()
  }
  console.log(configuration)
  const { imgUrl, width, height } = configuration

  return (
    <DesignConfigurator
      configId={configuration.id}
      imageDimensions={{ width, height }}
      imageUrl={imgUrl}
    />
  )
}

export default Design