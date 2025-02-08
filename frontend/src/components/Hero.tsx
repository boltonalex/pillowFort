const Hero = () => {
  return (
    <div className='bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-200 h-max-[500px] w-full'>
      <div className={`flex-col max-w-7xl items-center justify-center mx-auto text-center`}>
        <h1 className='text-5xl text-pink-500 p-20'>Build a Fort for your Investments</h1>
        <img className='mx-auto' src='./new-home-ensamble.svg' />
      </div>
    </div>
  )
}

export default Hero