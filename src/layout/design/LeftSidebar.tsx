/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useMemo, useState, FocusEvent } from "react";

import { IDesign } from "@/models/Design";
import { getShapeInfo } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useReactMutation } from "@/hooks/useReactQueryFn";

type Props = { allShapes: Array<any>; design: IDesign; refetch: () => void };

const LeftSidebar = ({ allShapes, design, refetch }: Props) => {
	const { id } = useParams<{ id: string }>();
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(design.title);
	const { mutate, isPending } = useReactMutation(
		`/user/teams/design/${id}`,
		"put"
	);

	const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
		e.preventDefault();

		const data = { title: e.target.value };
		mutate(data, {
			onSuccess: () => {
				refetch();
			},
			onError: (error) => {
				console.log(error);
				toast.error(error.response?.data.message || error.message);
			},
		});
		setIsEditing(false);
	};

	// memoize the result of this function so that it doesn't change on every render but only when there are new shapes
	const memoizedShapes = useMemo(
		() => (
			<section className="flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px] sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
				{isEditing ? (
					<Input
						defaultValue={title}
						onBlur={handleOnBlur}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Editing"
						className="h-[50px] border border-primary-grey-200 px-5 py-4 text-xs uppercase rounded-none"
					/>
				) : (
					<div
						onClick={() => setIsEditing((prev) => !prev)}
						className="w-full flex justify-between items-center border border-primary-grey-200 px-5 py-4 text-xs cursor-pointer"
					>
						<h3 className="uppercase">{design.title}</h3>

						{isPending && (
							<div className="text-primary-green text-xs">saving...</div>
						)}
					</div>
				)}
				<h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">
					Layers
				</h3>
				<div className="flex flex-col">
					{allShapes?.map((shape: any) => {
						const info = getShapeInfo(shape[1]?.type);

						return (
							<div
								key={shape[1]?.objectId}
								className="group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black"
							>
								<Image
									src={info?.icon}
									alt="Layer"
									width={16}
									height={16}
									className="group-hover:invert"
								/>
								<h3 className="text-sm font-semibold capitalize">
									{info.name}
								</h3>
							</div>
						);
					})}
				</div>
			</section>
		),
		[allShapes, design.title, isEditing]
	);

	return memoizedShapes;
};

export default LeftSidebar;
