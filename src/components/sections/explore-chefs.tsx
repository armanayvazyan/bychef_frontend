import chef from "@/assets/chef.jpeg";
import { CalendarCheck2 } from "lucide-react";
import Separator from "@/components/ui/separator";
import DatePicker from "@/components/ui/date-picker";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const chefs = [
  {
    name: "Alice",
    businessName: "Alice Kitchen",
    img: chef,
    dishes: ["healthy food", "salads", "fish", "meat", "desert", "healthy food", "salads", "fish", "meat", "desert", "healthy food", "salads", "fish", "meat", "desert", "healthy food", "salads", "fish", "meat", "desert"],
  },
  ...(new Array(20).fill({
    name: "Alice",
    businessName: "Alice Kitchen",
    img: chef,
    dishes: ["healthy food", "salads", "fish", "meat", "desert"],
  }))
];

const ChefCard = ({ chefInfo }: { chefInfo: typeof chefs[0] }) => {

  return (
    <Card className="overflow-hidden flex flex-col justify-between px-4 py-3 gap-4">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="min-w-[84px] min-h-[84px] w-[84px] h-[84px]">
              <img src={chefInfo.img} alt="chef image" className="w-full h-full rounded-full object-cover"/>
            </div>
            <p className="text-zinc-900 text-lg font-bold">{chefInfo.businessName}</p>
          </div>
          <p className="text-zinc-400 text-sm font-medium">
            {chefInfo.dishes.join(" • ")}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-0">
        <Separator/>
        <div className="flex items-center gap-2 text-[#15803D]">
          <CalendarCheck2 size={14} />
          <p className="text-sm font-medium">Available today</p>
        </div>
      </CardFooter>
    </Card>
  );
};

const ExploreChefs = () => {
  return (
    <section className="flex flex-col gap-4 px-[10%] pt-6">
      <h1 className="text-2xl font-bold text-zinc-800">{"Chef's near you"}</h1>
      <DatePicker/>
      {chefs.length ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-[104px]">
          {chefs.map((chef) => <ChefCard key={chef.businessName} chefInfo={chef}/>)}
        </div>
      ) : (
        <div className="w-full grid place-items-center min-h-[50dvh]">
          <h2 className="text-2xl font-bold">No chefs found</h2>
        </div>
      )}
    </section>
  );
};

export default ExploreChefs;