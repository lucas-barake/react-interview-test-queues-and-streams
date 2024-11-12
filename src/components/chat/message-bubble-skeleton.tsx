interface MessageBubbleSkeletonProps {
  width?: number;
}

export const MessageBubbleSkeleton: React.FC<MessageBubbleSkeletonProps> = ({ width = 200 }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-end gap-2">
        <div className="bg-muted animate-pulse rounded-2xl px-4 py-2">
          <div className="flex flex-col gap-1">
            <div className="bg-muted-foreground/20 h-4 rounded" style={{ width: `${width}px` }} />

            <div className="mt-1 flex items-center justify-end gap-1">
              <div className="bg-muted-foreground/20 h-3 w-12 rounded" />
              <div className="bg-muted-foreground/20 h-4 w-4 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
