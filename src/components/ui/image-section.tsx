interface IImageSectionProps {
  title: string;
  text: string;
  imgSrc: string;
}

const ImageSection = ({ title, text, imgSrc }: IImageSectionProps) => {
  return (
    <section className="flex justify-center mt-16 mb-24">
      <div className="flex items-center gap-12 w-full max-w-[930px] px-4 flex-col md:flex-row">
        <div className="max-w-[408px] w-full">
          <img src={imgSrc} alt="content" />
        </div>
        <div className="flex flex-col gap-3 max-w-[474px] w-full items-center md:items-start">
          <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
          <p className="text-zinc-500 text-center md:text-start">{text}</p>
        </div>
      </div>
    </section>
  );
};

export default ImageSection;