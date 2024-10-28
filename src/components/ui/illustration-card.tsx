interface IFeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: IFeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 max-h-[88px]">
        <img src={icon} alt="illustration" className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;