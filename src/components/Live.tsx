import {
	useBroadcastEvent,
	useEventListener,
	useMyPresence,
	useOthers,
} from "@liveblocks/react";
import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import CursorChat from "./cursor/CursorChat";
import ReactionSelector from "./reaction/ReactionButton";
import useInterval from "@/hooks/useInterval";
import FlyingReaction from "./reaction/FlyingReaction";
import { toast } from "sonner";
import { captureCanvasPreview } from "@/lib/canvas";
import { useParams } from "next/navigation";
import { useReactMutation } from "@/hooks/useReactQueryFn";

type Props = {
	canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};
const Live = ({ canvasRef }: Props) => {
	const { id } = useParams<{ id: string }>();
	const { mutate } = useReactMutation(`/design/${id}/save-preview`, "post");
	const others = useOthers();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [{ cursor }, updateMyPresence] = useMyPresence() as any;

	/**
	 * useBroadcastEvent is used to broadcast an event to all the other users in the room.
	 *
	 * useBroadcastEvent: https://liveblocks.io/docs/api-reference/liveblocks-react#useBroadcastEvent
	 */
	const broadcast = useBroadcastEvent();

	// store the reactions created on mouse click
	const [reactions, setReactions] = useState<Reaction[]>([]);

	// track the state of the cursor (hidden, chat, reaction, reaction selector)
	const [cursorState, setCursorState] = useState<CursorState>({
		mode: CursorMode.Hidden,
	});

	// set the reaction of the cursor
	const setReaction = useCallback((reaction: string) => {
		setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
	}, []);

	//   Remove reactions that are not visible anymore (every 1 sec)
	useInterval(() => {
		setReactions((reactions) =>
			reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
		);
	}, 1000);

	// Broadcast the reaction to other users (every 100ms)
	useInterval(() => {
		if (
			cursorState.mode === CursorMode.Reaction &&
			cursorState.isPressed &&
			cursor
		) {
			// concat all the reactions created on mouse click
			setReactions((reactions) =>
				reactions.concat([
					{
						point: { x: cursor.x, y: cursor.y },
						value: cursorState.reaction,
						timestamp: Date.now(),
					},
				])
			);

			// Broadcast the reaction to other users
			broadcast({
				x: cursor.x,
				y: cursor.y,
				value: cursorState.reaction,
			});
		}
	}, 100);

	/**
	 * useEventListener is used to listen to events broadcasted by other
	 * users.
	 *
	 * useEventListener: https://liveblocks.io/docs/api-reference/liveblocks-react#useEventListener
	 */
	useEventListener((eventData) => {
		const event = eventData.event as ReactionEvent;
		setReactions((reactions) =>
			reactions.concat([
				{
					point: { x: event.x, y: event.y },
					value: event.value,
					timestamp: Date.now(),
				},
			])
		);
	});

	// Listen to keyboard events to change the cursor state
	useEffect(() => {
		const onKeyUp = (e: KeyboardEvent) => {
			if (e.key === "/") {
				setCursorState({
					mode: CursorMode.Chat,
					previousMessage: null,
					message: "",
				});
			} else if (e.key === "Escape") {
				updateMyPresence({ message: "" });
				setCursorState({ mode: CursorMode.Hidden });
			} else if (e.key === "e") {
				setCursorState({ mode: CursorMode.ReactionSelector });
			}
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "/") {
				e.preventDefault();
			}
		};

		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [updateMyPresence]);

	// Listen to mouse events to change the cursor state
	const handlePointerMove = useCallback((event: React.PointerEvent) => {
		event.preventDefault();

		// if cursor is not in reaction selector mode, update the cursor position
		if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
			// get the cursor position in the canvas
			const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
			const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

			// broadcast the cursor position to other users
			updateMyPresence({
				cursor: {
					x,
					y,
				},
			});
		}
	}, []);

	// Hide the cursor when the mouse leaves the canvas
	const handlePointerLeave = useCallback(() => {
		setCursorState({
			mode: CursorMode.Hidden,
		});
		updateMyPresence({
			cursor: null,
			message: null,
		});
	}, []);

	// Show the cursor when the mouse enters the canvas
	const handlePointerDown = useCallback(
		(event: React.PointerEvent) => {
			// get the cursor position in the canvas
			const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
			const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

			updateMyPresence({
				cursor: {
					x,
					y,
				},
			});

			// if cursor is in reaction mode, set isPressed to true
			setCursorState((state: CursorState) =>
				cursorState.mode === CursorMode.Reaction
					? { ...state, isPressed: true }
					: state
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[cursorState.mode, setCursorState]
	);

	// hide the cursor when the mouse is up
	const handlePointerUp = useCallback(() => {
		setCursorState((state: CursorState) =>
			cursorState.mode === CursorMode.Reaction
				? { ...state, isPressed: false }
				: state
		);
	}, [cursorState.mode, setCursorState]);

	const saveCanvas = useCallback(async () => {
		if (!canvasRef.current) return;

		console.log("Hit saving file");

		try {
			const preview = await captureCanvasPreview(canvasRef.current);
			if (!preview) return;

			const blob = await fetch(preview).then((res) => res.blob());
			const formData = new FormData();
			formData.append("preview", blob);
			formData.append("designId", id); // Add your design ID here

			mutate(formData, {
				onSuccess: (data) => {
					console.log(data);

					toast.success("Design saved successfully");
				},
				onError: (error) => {
					console.error("Save error:", error);
					toast.error("Failed to save design");
				},
			});

			// const response = await fetch("/api/design/save-preview", {
			// 	method: "POST",
			// 	body: formData,
			// });

			// if (!response.ok) throw new Error("Failed to save");

			// toast.success("Design saved successfully");
		} catch (error) {
			toast.error("Failed to save design");
			console.error("Save error:", error);
		}
	}, [canvasRef]);

	// Auto-save every 5 minutes
	useEffect(() => {
		const autoSaveInterval = setInterval(saveCanvas, 5 * 60 * 1000);

		return () => clearInterval(autoSaveInterval);
	}, [saveCanvas]);

	// Ctrl+S shortcut handler
	useEffect(() => {
		const handleKeyDown = async (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault();
				console.log("Hit ctrl S");
				await saveCanvas();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [saveCanvas]);

	return (
		<div
			id="canvas"
			onPointerUp={handlePointerUp}
			onPointerMove={handlePointerMove}
			onPointerDown={handlePointerDown}
			onPointerLeave={handlePointerLeave}
			className="w-full min-h-[90dvh] border-2 border-green-500 relative"
		>
			<canvas ref={canvasRef} />

			{/* Render the reactions */}
			{reactions.map((reaction) => (
				<FlyingReaction
					key={reaction.timestamp.toString()}
					x={reaction.point.x}
					y={reaction.point.y}
					timestamp={reaction.timestamp}
					value={reaction.value}
				/>
			))}

			{/* If cursor is in chat mode, show the chat cursor */}
			{cursor && (
				<CursorChat
					cursor={cursor}
					cursorState={cursorState}
					setCursorState={setCursorState}
					updateMyPresence={updateMyPresence}
				/>
			)}

			{/* If cursor is in reaction selector mode, show the reaction selector */}
			{cursorState.mode === CursorMode.ReactionSelector && (
				<ReactionSelector
					setReaction={(reaction) => {
						setReaction(reaction);
					}}
				/>
			)}

			<LiveCursors others={others} />

			<div className="absolute top-4 right-4 flex items-center gap-2">
				<span className="text-xs text-gray-500">Auto-save enabled</span>
			</div>
		</div>
	);
};

export default Live;
