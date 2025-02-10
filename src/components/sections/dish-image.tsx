import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface IDishImageProps {
  url?: string;
}

const DishImage = ({ url }: IDishImageProps) => {
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
    <div className="h-[220px] md:h-[282px]">
      {isLoaded ? (
        <img
          src={url}
          ref={ref}
          alt="dish image"
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <Skeleton className="w-full h-full rounded-xl" />
      )}
    </div>
  );
};

export default DishImage;