import React, { useEffect, useState } from 'react';
import phone from '@/assets/images/auth-slideshow-phone.png';
import slide1 from '@/assets/images/slideshow-img-1.jpg';
import slide2 from '@/assets/images/slideshow-img-2.jpg';
import slide3 from '@/assets/images/slideshow-img-3.jpg';
import slide4 from '@/assets/images/slideshow-img-4.jpg';
import slide5 from '@/assets/images/slideshow-img-5.jpg';

const slides = [slide1, slide2, slide3, slide4, slide5];

const authTemplate = (WrapComponent) => {
  const ComponentWithAuthTemplate = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setActive((prev) => (prev + 1) % slides.length);
      }, 3000);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <div className="flex w-full max-w-4xl items-center justify-center gap-8">
          {/* Phone showcase (desktop only) */}
          <div className="relative hidden h-[580px] w-[420px] shrink-0 lg:block">
            <img src={phone} alt="" className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain" />
            <div className="absolute left-[24%] top-[3%] h-[92%] w-[52%] overflow-hidden rounded-[6px]">
              {slides.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                    i === active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Auth form */}
          <div className="w-full max-w-sm">
            <WrapComponent />
          </div>
        </div>
      </div>
    );
  };

  return ComponentWithAuthTemplate;
};

export default authTemplate;
