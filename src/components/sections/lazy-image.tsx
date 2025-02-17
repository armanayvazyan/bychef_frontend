import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface IDishImageProps {
  alt: string;
  url?: string;
  imgClassName?: string;
  containerClassName?: string;
}

const LazyImage = ({ url, alt, imgClassName, containerClassName }: IDishImageProps) => {
  const ref = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadImage = (src: string) => {
    const img = new Image();
    img.onload = () => { setIsLoaded(true); };
    img.src = src;
  };

  useEffect(() => {
    if (url) {
      loadImage(url);
    }
  }, [url]);

  return (
    <div className={containerClassName}>
      {isLoaded ? (
        <img
          src={url}
          ref={ref}
          alt={alt}
          className={imgClassName}
        />
      ) : (
        <Skeleton className="w-full h-full rounded-xl" />
      )}
    </div>
  );
};

export default LazyImage;