
import { notFound } from 'next/navigation'
import DesignPreview from './DesignPreview'
import imageSchema from '../../../utils/schema'


const Page = async ({ searchParams }) => {
  const { id } = searchParams

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await imageSchema.findById(id)

  if(!configuration) {
    return notFound()
  }
  console.log(configuration)
  return <DesignPreview configuration={configuration} />
}

export default Page
