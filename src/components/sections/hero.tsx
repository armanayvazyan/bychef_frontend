import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import useFetchData from "@/hooks/use-fetch-data";

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
    name: "",
    phone: ""
  });

  const { fetchData } = useFetchData("waitlist");
  const { toast } = useToast();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInfo(info => ({
      ...info,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmitData = useCallback(async (e: FormEvent<UsernameFormElement>): Promise<void> => {
    e.preventDefault();

    const response = await fetchData({
      method: "POST",
      bodyParams: {
        fullName: e.currentTarget.elements.nameInput.value,
        phoneNumber: e.currentTarget.elements.phoneInput.value,
      }
    });

    if (!response?.error) {
      toast({
        title: "Գրանցումը կատարված է",
        description: "Սպասե՜ք նորություններին",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: response.error,
      });
    }
  }, [fetchData, toast]);

  return (
    <section className="hero relative">
      <form onSubmit={handleSubmitData}>
        <img src="https://static.bychef.am/landing/hero.webp" alt="hero image" className="object-cover w-full h-[718px]"/>
        <div className="absolute w-full max-w-[560px] px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white flex flex-col items-center pl-8 p-6 gap-3">
            <h1 className="text-2xl font-extrabold">{t("subscribe.title")}</h1>
            <p className="text-center text-zinc-600">{t("subscribe.details")}</p>
            <Input type="text" placeholder={t("subscribe.nameInput")} value={info.name} onChange={handleChange} name="name" id="nameInput" />
            <Input type="text" placeholder={t("subscribe.phoneInput")} value={info.phone} onChange={handleChange} name="phone" id="phoneInput" />
            <Button type="submit">{t("subscribe.button")}</Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default HeroTemp;