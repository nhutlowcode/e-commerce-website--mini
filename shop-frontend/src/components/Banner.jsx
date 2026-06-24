
function Banner() {
  return (
    <div className='bg-blue-600 text-white over-flow-hidden'>
        <div className='max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8'>
            {/* Cột nội dung */}
            <div className='md:w-1/2 text-center md:text-left'>
                <h1 className='text-4xl md:text-6xl font-extrabold mb-4 leading-tight'>
                    Chào mùa hè rực rỡ {" "}
                    <span className='text-yellow-300'>
                     Sale sập sàn 50%
                    </span>
                </h1>
                <p className='text-lg md:text-xl mb-8 text-blue-100'>
                    Săn ngay những bộ outfit cực chất với mức giá không thể rẻ hơn. Khám phá bộ sưu tập mới nhất của chúng tôi ngay hôm nay!
                </p>
                <button className='bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-500 transtion-all transform hover:translate-y-1'>
                    Mua ngay kẻo lỡ
                </button>
            </div>

            {/* Cột hình ảnh */}
            <div className='md:w-1/2 flex justify-center'>
                <img 
                    src="https://placehold.co/600x400/ffffff/2563eb?text=Summer+Sale" 
                    alt="Khuyến mãi mùa hè" 
                    className='rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-300'
                />
            </div>
        </div>
    </div>
  )
}

export default Banner