import AspectRatio from "@/components/ui/aspect-ratio";

interface IFeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: IFeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-[88px]">
        <AspectRatio ratio={1}>
          <img src={icon} alt="illustration" />
        </AspectRatio>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;