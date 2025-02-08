const FundsCard = () => {
  return (
    <div className='mx-auto w-full flex items-center gap-4 my-10 rounded-4xl bg-gray-200 max-w-296'>
      <div className="w-1/2 p-14">
        <p className='text-4xl pb-10'>Ready-made, optimised investment portfolios</p>
        <p>Our ready made portfolios make it easy to start with Stocks and Shares ISAs.</p>
        <ul className="flex flex-col gap-y-5 mt-10">
          <li className='flex gap-x-4'><img src='./tick.svg' />Choose the right level of risk for you</li>
          <li className='flex gap-x-4'><img src='./tick.svg' />No complicated decisions to make</li>
          <li className='flex gap-x-4'><img src='./tick.svg' />Do it via the app</li>
        </ul>
      </div>
      <div className="w-1/2 pt-4">
        <img src='./funds.webp' />
      </div>
    </div>
  )
}

export default FundsCard