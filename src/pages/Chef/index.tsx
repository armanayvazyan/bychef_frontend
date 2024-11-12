import { chefInfo } from "@/configs/constants";
import ChefDishes from "@/components/sections/chef-dishes";
import ChefDetails from "@/components/sections/chef-details";

const Chef = () => {
  return (
    <section className="px-6 md:px-[10%]">
      <ChefDetails details={chefInfo}  />
      <ChefDishes workdays={chefInfo.workingDays} />
    </section>
  );
};

export default Chef;