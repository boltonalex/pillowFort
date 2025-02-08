import { SwiperSlide } from 'swiper/react';

const FundsCarouselCard = ({ fund }) => {
  return (
    <SwiperSlide >
      <p> {fund.name} </p>
    </SwiperSlide>
  )
}

export default FundsCarouselCard