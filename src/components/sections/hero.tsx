import Button from "@/components/ui/button";
import Map from "@/components/sections/map-dialog";
import SearchInput from "@/components/sections/address-search";

const HeroTemp = () => {
  return (
    <section className="hero relative">
      <img src="https://static.bychef.am/landing/hero.webp" alt="hero image" className="object-cover w-full h-[718px]"/>
      <div className="absolute w-full max-w-[560px] px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white flex flex-col items-center pl-8 p-6 gap-3">
          <h1 className="text-2xl font-extrabold">Ընտրեք ձեր առաքման հասցեն</h1>
          <p className="text-center text-zinc-600">Գրեք այն հասցեն, որտեղ կուզենաք որպեսզի առաքեն ձեր պատվերը</p>
          <div className="flex gap-2 w-full">
            <SearchInput />
          </div>
          <div className="w-full">
            <Map
              trigger={
                <div className="flex justify-start w-full">
                  <Button variant="ghost2">Գտնել քարտեզով այստեղ</Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroTemp;