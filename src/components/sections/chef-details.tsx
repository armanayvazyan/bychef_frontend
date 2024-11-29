import chef from "@/assets/chef.jpeg";
import Chip from "@/components/ui/chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DynamicIcon from "@/components/ui/DynamicIcon";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface IChefDetails {
  details: {
    img: string;
    name: string;
    about: string;
    dishes: string[];
    socials: {
      name: string;
      icon: keyof typeof dynamicIconImports;
      url: string
    }[];
    businessName: string;
    workingDays: number[];
  }
}

const ChefDetails = ({ details }: IChefDetails) => {
  return (
    <div>
      <div className="flex items-start gap-6 mt-6 flex-wrap md:flex-nowrap">
        <Avatar className="w-[84px] h-[84px] md:w-[206px] md:h-[206px]">
          <AvatarImage src={chef} alt="chef image" className="w-full h-full object-cover"/>
          <AvatarFallback>{details.name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4">
          <h1 className="text-zinc-900 font-bold text-base md:text-2xl">{details.businessName}</h1>
          <h2 className="text-base text-primary">{details.name}</h2>
          <div className="flex items-center gap-3">
            {details.socials.map((social) => (
              <a className="flex gap-2 items-center" key={social.url} href={social.url}>
                <DynamicIcon name={social.icon} />
                <p className="text-xs font-semibold text-primary">{social.name}</p>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {details.dishes.map(dish => (
              <Chip key={dish} label={dish}/>
            ))}
          </div>
          <p className="text-zinc-500 text-xs md:text-base hidden md:block">{details.about}</p>
        </div>
      </div>
      <p className="mt-2 text-zinc-500 text-xs md:text-base md:hidden">{details.about}</p>
    </div>
  );
};

export default ChefDetails;