type Props = {
  title: string;
  id: number;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
};

export const RegionCard = ({ title, id, onClick, disabled, active }: Props) => (
  <div onClick={() => onClick(id)}
       className="border rounded p-4 cursor-pointer hover:bg-black/5">
    <p>{title}</p>
    {active && <span>✔</span>}
  </div>
);
