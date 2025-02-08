import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/bundle'; // Navigation module

const funds = [
  { name: "Ethical CushionMix", likelyReturn: "£6,866", goodCase: "£7,789", worstCase: "£6,080" },
  { name: "Cushon Universal Balanced", likelyReturn: "£6,859", goodCase: "£7,879", worstCase: "£6,080" },
  { name: "Other Cushon Universal Balanced", likelyReturn: "£6,859", goodCase: "£7,879", worstCase: "£6,080" }
];


const FundsCarousel = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow]}
      spaceBetween={5}
      slidesPerView={3}
      pagination={{ clickable: true }}
      navigation
      effect='coverflow'
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >


      <SwiperSlide className="p-10 h-[300px] bg-gray-600">Slide 1</SwiperSlide>
      <SwiperSlide className="p-10 h-[300px] bg-gray-600">Slide 2</SwiperSlide>
      <SwiperSlide className="p-10 h-[300px] bg-gray-600">Slide 3</SwiperSlide>
      <SwiperSlide className="p-10 h-[300px] bg-gray-600">Slide 4</SwiperSlide>


    </Swiper>
  );
};

export default FundsCarousel;