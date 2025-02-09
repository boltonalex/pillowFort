import CushonButton from './CushonButton'

const CTA = () => {
  return (
    <div className='mx-auto w-full flex flex-col items-center gap-4 my-10'>
      <div>Getting started with Cushon is easy</div>
      <CushonButton clickTarget={'fundList'}>Get Started</CushonButton>
    </div>
  )
}

export default CTA