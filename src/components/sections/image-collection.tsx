const ImageCollection = () => {
  return (
    <div className="w-full px-4 md:px-0">
      <img className="w-full object-cover h-0 md:h-auto" src="https://static.bychef.am/landing/collage.webp" alt="image collection" />
      <img className="w-full object-cover h-auto md:h-0" src="https://static.bychef.am/landing/collage_mobile.webp" alt="image collection" />
    </div>
  );
};

export default ImageCollection;