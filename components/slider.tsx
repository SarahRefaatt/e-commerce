"use client";

import * as React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from "@/components/ui/carousel";

const images = [
  "/assets/img1.png",
  "/assets/img2.png",
  "/assets/img3.png",
  "/assets/img2.png",
];

export default function Slider() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (

    <div className="relative w-full h-full bg-transparent">
      {/* Main Carousel - this should be your only image display */}
      <div className="relative inset-0 flex items-center justify-center">
        <Carousel 
          setApi={setApi}
          className="w-full max-w-lg" 
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-0 overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-contain p-8 transition-transform duration-300 hover:scale-105"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="relative left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="relative right-2 top-1/2 -translate-y-1/2" /> */}
        </Carousel>
      </div>

      {/* Thumbnail Navigation */}
      <div className=" bottom-4 left-0 right-0 flex justify-center gap-2 p-4">
        {images.map((_, index) => (
          <button 
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden transition-all ${
              current === index ? "ring-2 ring-primary" : "opacity-70"
            }`}
          >
            <img
              src={images[index]}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>

  );
}