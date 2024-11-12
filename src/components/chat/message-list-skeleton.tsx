import { MessageBubbleSkeleton } from "./message-bubble-skeleton";

export const MessageListSkeleton: React.FC = () => {
  const widths = [180, 260, 200, 180, 260, 200, 180, 260, 200];

  return (
    <div className="flex flex-col gap-4 p-4">
      {widths.map((width, i) => (
        <MessageBubbleSkeleton key={i} width={width} />
      ))}
    </div>
  );
};
