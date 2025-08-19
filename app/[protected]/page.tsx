

export default function products() {
  return (
<div className="grid grid-flow-row auto-rows-auto gap-8 p-8 w-full min-h-screen bg-gray-50">
  {/* First image */}


  {/* Second image */}
  <div className="flex justify-center">
    <div className="relative w-full max-w-[40%] bg-white rounded-xl shadow-xl overflow-hidden">
      <img
        src="/assets/img3.png"
        alt="Image 02"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
        <h3 className="text-lg font-semibold">Image Title 02</h3>
      </div>
    </div>
  </div>

  {/* Third image */}
  <div className="flex justify-center">
    <div className="relative w-full max-w-[40%] bg-white rounded-xl shadow-xl overflow-hidden">
      <img
        src="/assets/img1.png"
        alt="Image 03"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
        <h3 className="text-lg font-semibold">Image Title 03</h3>
      </div>
    </div>
  </div>

  {/* Fourth image */}
  <div className="flex justify-center">
    <div className="relative w-full max-w-[40%] bg-white rounded-xl shadow-xl overflow-hidden">
      <img
        src="/assets/img3.png"
        alt="Image 04"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
        <h3 className="text-lg font-semibold">Image Title 04</h3>
      </div>
    </div>
  </div>

  {/* Fifth image */}
  <div className="flex justify-center">
    <div className="relative w-full max-w-[40%] bg-white rounded-xl shadow-xl overflow-hidden">
      <img
        src="/assets/img1.png"
        alt="Image 05"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
        <h3 className="text-lg font-semibold">Image Title 05</h3>
      </div>
    </div>
  </div>

  {/* Sixth image */}
  <div className="flex justify-center">
    <div className="relative w-full max-w-[40%] bg-white rounded-xl shadow-xl overflow-hidden">
      <img
        src="/assets/img3.png"
        alt="Image 06"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
        <h3 className="text-lg font-semibold">Image Title 06</h3>
      </div>
    </div>
  </div>

  {/* Seventh image */}
  <div className="flex justify-center">
    <div className="relative w-full max-w-[40%] bg-white rounded-xl shadow-xl overflow-hidden">
      <img
        src="/assets/img1.png"
        alt="Image 07"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
        <h3 className="text-lg font-semibold">Image Title 07</h3>
      </div>
    </div>
  </div>

  
</div>

  );
}
