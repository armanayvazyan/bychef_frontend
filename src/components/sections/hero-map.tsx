import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Map from "@/components/sections/map";

interface FormElements extends HTMLFormControlsCollection {
  nameInput: HTMLInputElement
  phoneInput: HTMLInputElement
}

interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

const HeroTemp = () => {
  const { t } = useTranslation("translation", { keyPrefix: "home-page" });

  const [info, setInfo] = useState({
    address: "",
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInfo(info => ({
      ...info,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmitData = useCallback(async (e: FormEvent<UsernameFormElement>): Promise<void> => {
    e.preventDefault();
  }, []);

  return (
    <section className="hero relative">
      <form onSubmit={handleSubmitData}>
        <img src="https://static.bychef.am/landing/hero.webp" alt="hero image" className="object-cover w-full h-[718px]"/>
        <div className="absolute w-full max-w-[560px] px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white flex flex-col items-center pl-8 p-6 gap-3">
            <h1 className="text-2xl font-extrabold">Ընտրեք ձեր առաքման հասցեն</h1>
            <p className="text-center text-zinc-600">Գրեք այն հասցեն, որտեղ կուզենաք ոռպեսզի առաքեն ձեր պատվերը</p>
            <div className="flex gap-2 w-full">
              <Input
                type="text"
                name="address"
                id="addressInput"
                value={info.address}
                onChange={handleChange}
                placeholder="Մուտքագրեք հասցեն"
              />
              <Button type="submit" disabled={!info.address}>{t("subscribe.button")}</Button>
            </div>
            <Map trigger={<Button variant="ghost2">Գտնել քարտեզով այստեղ</Button>} />
          </div>
        </div>
      </form>
    </section>
  );
};

export default HeroTemp;