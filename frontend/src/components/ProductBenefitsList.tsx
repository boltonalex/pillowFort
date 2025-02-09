const productBenefits = [
  {
    text: 'Start with a little as £100 or from £50 a month via direct debit',
    img: "./money.svg"
  },
  {
    text: 'Create as many savings pots as you want for different goals',
    img: "./jar.svg"
  },
  {
    text: 'See which investment funds are performing best and easily switch',
    img: './graph.svg'
  },
  {
    text: 'Make it even easier with a ready-made portfolio to get you started',
    img: './puzzle.svg'
  },
  {
    text: 'Check, manage and access your money with our friendly app',
    img: './app.svg'
  }
]

const ProductBenefitsList = () => {
  return (
    <div className="max-w-6xl mx-auto my-10 flex flex-col md:flex-row justify-between items-center gap-6 px-4">
      {productBenefits.map((benefit, index) => (
        <div key={index} className={`flex flex-col items-center text-center gap-4 p-4 mt-4 max-w-xs ${index !== 0 && index !== productBenefits.length ? 'md:border-l md:border-gray-300' : ''
          }`}>
          <img src={benefit.img} alt="" className="w-16 h-16 text-pink-500" />
          <p className="text-gray-800 text-lg font-medium leading-relaxed">{benefit.text}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductBenefitsList