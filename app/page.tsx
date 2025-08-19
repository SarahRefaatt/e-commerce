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
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CardWithForm } from "@/components/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
type Product ={
    id: number;
    name?: string;
    description?: string;
    price?: string;
    stock_quantity?: string;
    image_url?: string;
      productVariant?: {
    id: number;
    color: string;
    size: string;
    quantity: number;
  }[];
  }
interface Slide {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  ctaText?: string;
}

const slides: Slide[] = [
  { 
    src: "/assets/i1.png", 
    alt: "Premium products", 
    title: "Summer Collection 2023",
    description: "Discover our new arrivals"
  },
  { 
    src: "/assets/i2.png", 
    alt: "Special offers", 
    title: "Limited Time Offer",
    description: "Get 30% off on selected items"
  },
  { 
    src: "/assets/i1.png", 
    alt: "Fast delivery", 
    title: "Free Shipping",
    description: "On all orders over $50"
  },
  { 
    src: "/assets/i2.png", 
    alt: "Customer satisfaction", 
    title: "Satisfaction Guaranteed",
    description: "15-day return policy"
  },
];

// const featuredCategories: Category[] = [
//   { name: "Men's Fashion", src: "/assets/i2.png", alt: "Men's fashion" },
//   { name: "Women's Fashion", src: "/assets/i2.png", alt: "Women's fashion" },
//   { name: "Electronics", src: "/assets/i2.png", alt: "Electronics" },
//   { name: "Home & Living", src: "/assets/i2.png", alt: "Home goods" },
// ];

// const testimonials: Testimonial[] = [
//   {
//     quote: "The quality exceeded my expectations! Fast shipping and excellent customer service.",
//     author: "Sarah Johnson",
//     rating: 5
//   },
//   {
//     quote: "I've ordered multiple times and always been satisfied with my purchases.",
//     author: "Michael Chen",
//     rating: 4
//   },
//   {
//     quote: "Great prices for such high-quality products. Will definitely shop here again!",
//     author: "Emma Rodriguez",
//     rating: 5
//   },
// ];

export default function ECommerceCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 7000); // Auto-advance every 7 seconds

    return () => clearInterval(interval);
  }, [api]);

    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
  
    React.useEffect(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/products");
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Fetched data:", data.products);
  
  if (data.products && Array.isArray(data.products)) {
            setProducts(data.products);
          } else {
            throw new Error("Expected a 'products' array in the response");
          }
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setError(error instanceof Error ? error.message : "Failed to fetch products");
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProducts();
    }, []);
  return (
    <div className="space-y-16">
      {/* Hero Carousel Section */}
      <section className="relative w-full">

        
  <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
    <CarouselContent>
      {slides.map((slide, index) => (
     <CarouselItem key={index}>
     <div className="relative group">
       {/* ✅ Pure container without Card */}
       <div className="p-0 aspect-[16/9] md:aspect-[21/9] lg:aspect-[25/9]">
         <img
           src={slide.src}
           alt={slide.alt}
           className="w-full h-full object-cover block border-none outline-none shadow-none"
           loading={index === 0 ? "eager" : "lazy"}
           draggable={false}
         />
       </div>
   
       {/* Overlay */}
       <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent flex items-center pointer-events-none">
         <div className="container mx-auto px-6 pointer-events-auto">
           <div className="max-w-xl text-white space-y-5">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-md">
               {slide.title}
             </h2>
             <p className="text-lg md:text-xl text-white/90">
               {slide.description}
             </p>
           
             <Link href={`/s/products`}><Button
               size="lg"
               className="mt-2 bg-primary hover:bg-primary/90 text-white font-semibold transition-colors"
             >
               {slide.ctaText || "Shop Now"}
             </Button></Link>
             
           </div>
         </div>
       </div>
     </div>
   </CarouselItem>
   



      ))}
    </CarouselContent>

    {/* Navigation Arrows */}
    <CarouselPrevious className="left-4 hidden md:flex" />
    <CarouselNext className="right-4 hidden md:flex" />

    {/* Pagination Dots */}
    <div className="absolute bottom-6 left-0 right-0">
      <div className="flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-3 rounded-full transition-all duration-300 aria-current:!bg-white ${
              currentSlide === index
                ? "bg-white w-6"
                : "bg-white/50 w-3 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  </Carousel>
</section>





      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of products curated just for you
          </p>
        </div>
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredCategories.map((category, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img 
                src={category.src} 
                alt={category.alt} 
                className="w-full h-48 md:h-60 object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                <h3 className="text-white font-bold text-lg">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div> */}
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked selection of our best-selling items
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {        products?.slice(0,4).map((product) => (
          <div 
            key={product.id} 
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
           
            <CardWithForm product={product} />
          </div>
        ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            <a href="/s/products" className="flex items-center justify-center">
              <span>View All Products</span>
              </a>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Customer Reviews</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear what our satisfied customers have to say
          </p>
        </div>
        {/* <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold text-gray-800">— {testimonial.author}</p>
            </div>
          ))}
        </div> */}
      </section>

      {/* Newsletter */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for the latest products and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="bg-primary hover:bg-primary/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}