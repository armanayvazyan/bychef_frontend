const Chip = ({ label }: { label: string }) => {
  return (
    <span className="px-3 py-2 bg-zinc-100 w-max text-zinc-900 rounded-md text-xs md:text-sm">
      {label}
    </span>
  );
};

export default Chip;