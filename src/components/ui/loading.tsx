type Props = {
	size?: "sm" | "md" | "lg";
};

export function Loading({ size = "sm" }: Props) {
	const getSize = () => {
		switch (size) {
			case "sm":
				return "w-6 h-6";

			case "md":
				return "w-10 h-10";

			case "lg":
				return "w-20 h-20";

			default:
				return "w-10 h-10";
		}
	};

	return (
		<div className="flex items-center justify-center h-fit bg-transparent">
			<div className={`${getSize()} relative`}>
				<div className="absolute inset-0 border-2 border-transparent border-t-inherit border-r-inherit rounded-full animate-spin"></div>
				<div className="absolute inset-1 border-2 border-transparent border-t-inherit border-r-inherit rounded-full animate-spin-reverse"></div>
			</div>
		</div>
	);
}
