const Chip = ({ label }: { label: string }) => {
  return (
    <span className="px-3 py-2 bg-zinc-100 w-max text-zinc-500 rounded-md text-sm whitespace-nowrap">
      {label}
    </span>
  );
};

export default Chip;