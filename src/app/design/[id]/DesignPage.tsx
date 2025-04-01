/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { fabric } from "fabric";
import Navbar from "@/layout/design/Navbar";

import Live from "@/components/Live";
import LeftSidebar from "@/layout/design/LeftSidebar";
import RightSidebar from "@/layout/design/RightSidebar";
import { useEffect, useRef, useState } from "react";
import {
	handleCanvaseMouseMove,
	handleCanvasMouseDown,
	handleCanvasMouseUp,
	handleCanvasObjectModified,
	handleCanvasObjectMoving,
	handleCanvasObjectScaling,
	handleCanvasSelectionCreated,
	handleCanvasZoom,
	handlePathCreated,
	handleResize,
	initializeFabric,
	renderCanvas,
} from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";
import { handleImageUpload } from "@/lib/shapes";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";

export default function Page() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fabricRef = useRef<fabric.Canvas | null>(null);
	const isDrawing = useRef(false);
	const shapeRef = useRef<fabric.Object | null>(null);
	const activeObjectRef = useRef<fabric.Object | null>(null);
	const selectedShapeRef = useRef<string | null>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const isEditingRef = useRef(false);

	const [activeElement, setActiveElement] = useState<ActiveElement>({
		name: "",
		value: "",
		icon: "",
	});

	const [elementAttributes, setElementAttributes] = useState<Attributes>({
		width: "",
		height: "",
		fontSize: "",
		fontFamily: "",
		fontWeight: "",
		fill: "#aabbcc",
		stroke: "#aabbcc",
	});

	/**
	 * useUndo and useRedo are hooks provided by Liveblocks that allow you to
	 * undo and redo mutations.
	 *
	 * useUndo: https://liveblocks.io/docs/api-reference/liveblocks-react#useUndo
	 * useRedo: https://liveblocks.io/docs/api-reference/liveblocks-react#useRedo
	 */
	const undo = useUndo();
	const redo = useRedo();

	const canvasObjects = useStorage(
		(root: { canvasObjects?: LiveMap<string, any> }) =>
			root.canvasObjects || new LiveMap<string, any>()
	);

	console.log("Canvas Objects: ", canvasObjects);

	const syncShapeInStorage = useMutation(({ storage }, object) => {
		// if the passed object is null, return
		if (!object) return;
		const { objectId } = object;

		/**
		 * Turn Fabric object (kclass) into JSON format so that we can store it in the
		 * key-value store.
		 */
		const shapeData = object.toJSON();
		shapeData.objectId = objectId;

		const canvasObjects = storage.get("canvasObjects" as never) as LiveMap<
			string,
			any
		>;
		/**
		 * set is a method provided by Liveblocks that allows you to set a value
		 *
		 * set: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.set
		 */
		canvasObjects.set(objectId, shapeData);
	}, []);

	const deleteAllShapes = useMutation(({ storage }) => {
		// get the canvasObjects store
		const canvasObjects = storage.get("canvasObjects" as never) as LiveMap<
			string,
			any
		>;

		// if the store doesn't exist or is empty, return
		if (!canvasObjects || canvasObjects.size === 0) return true;

		// delete all the shapes from the store
		for (const [key] of canvasObjects.entries()) {
			canvasObjects.delete(key);
		}

		// return true if the store is empty
		return canvasObjects.size === 0;
	}, []);

	const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
		/**
		 * canvasObjects is a Map that contains all the shapes in the key-value.
		 * Like a store. We can create multiple stores in liveblocks.
		 *
		 * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
		 */
		const canvasObjects = storage.get("canvasObjects" as never) as LiveMap<
			string,
			any
		>;
		canvasObjects.delete(shapeId);
	}, []);

	const handleActiveElement = (elem: ActiveElement) => {
		setActiveElement(elem);

		switch (elem?.value) {
			// delete all the shapes from the canvas
			case "reset":
				// clear the storage
				deleteAllShapes();
				// clear the canvas
				fabricRef.current?.clear();
				// set "select" as the active element
				setActiveElement(defaultNavElement);
				break;

			// delete the selected shape from the canvas
			case "delete":
				// delete it from the canvas
				handleDelete(fabricRef.current as any, deleteShapeFromStorage);
				// set "select" as the active element
				setActiveElement(defaultNavElement);
				break;

			// upload an image to the canvas
			case "image":
				// trigger the click event on the input element which opens the file dialog
				imageInputRef.current?.click();
				/**
				 * set drawing mode to false
				 * If the user is drawing on the canvas, we want to stop the
				 * drawing mode when clicked on the image item from the dropdown.
				 */
				isDrawing.current = false;

				if (fabricRef.current) {
					// disable the drawing mode of canvas
					fabricRef.current.isDrawingMode = false;
				}
				break;

			// for comments, do nothing
			case "comments":
				break;

			default:
				// set the selected shape to the selected element
				selectedShapeRef.current = elem?.value as string;
				break;
		}
	};

	useEffect(() => {
		const canvas = initializeFabric({ canvasRef, fabricRef });

		canvas.on("mouse:down", (options) => {
			handleCanvasMouseDown({
				options,
				canvas,
				isDrawing,
				shapeRef,
				selectedShapeRef,
			});
		});

		canvas.on("mouse:move", (options) => {
			handleCanvaseMouseMove({
				options,
				canvas,
				isDrawing,
				shapeRef,
				selectedShapeRef,
				syncShapeInStorage,
			});
		});

		canvas.on("mouse:up", () => {
			handleCanvasMouseUp({
				canvas,
				isDrawing,
				shapeRef,
				selectedShapeRef,
				syncShapeInStorage,
				setActiveElement,
				activeObjectRef,
			});
		});
		canvas.on("path:created", (options) => {
			handlePathCreated({
				options,
				syncShapeInStorage,
			});
		});

		canvas.on("object:modified", (options) => {
			handleCanvasObjectModified({
				options,
				syncShapeInStorage,
			});
		});

		canvas?.on("object:moving", (options) => {
			handleCanvasObjectMoving({
				options,
			});
		});

		canvas.on("selection:created", (options) => {
			handleCanvasSelectionCreated({
				options,
				isEditingRef,
				setElementAttributes,
			});
		});

		canvas.on("object:scaling", (options) => {
			handleCanvasObjectScaling({
				options,
				setElementAttributes,
			});
		});

		canvas.on("mouse:wheel", (options) => {
			handleCanvasZoom({
				options,
				canvas,
			});
		});

		window.addEventListener("resize", () => {
			handleResize({
				canvas: fabricRef.current,
			});
		});

		/**
		 * listen to the key down event on the window which is fired when the
		 * user presses a key on the keyboard.
		 *
		 * We're using this to perform some actions like delete, copy, paste, etc when the user presses the respective keys on the keyboard.
		 */
		window.addEventListener("keydown", (e) =>
			handleKeyDown({
				e,
				canvas: fabricRef.current,
				undo,
				redo,
				syncShapeInStorage,
				deleteShapeFromStorage,
			})
		);

		// dispose the canvas and remove the event listeners when the component unmounts
		return () => {
			/**
			 * dispose is a method provided by Fabric that allows you to dispose
			 * the canvas. It clears the canvas and removes all the event
			 * listeners
			 *
			 * dispose: http://fabricjs.com/docs/fabric.Canvas.html#dispose
			 */
			canvas.dispose();

			// remove the event listeners
			window.removeEventListener("resize", () => {
				handleResize({
					canvas: null,
				});
			});

			window.removeEventListener("keydown", (e) =>
				handleKeyDown({
					e,
					// eslint-disable-next-line react-hooks/exhaustive-deps
					canvas: fabricRef.current,
					undo,
					redo,
					syncShapeInStorage,
					deleteShapeFromStorage,
				})
			);
		};
	}, [canvasRef]);

	useEffect(() => {
		renderCanvas({
			fabricRef,
			canvasObjects,
			activeObjectRef,
		});
	}, [canvasObjects]);

	return (
		<main className="w-full h-screen overflow-hidden">
			<Navbar
				imageInputRef={imageInputRef}
				activeElement={activeElement}
				handleImageUpload={(e: any) => {
					// prevent the default behavior of the input element
					e.stopPropagation();

					handleImageUpload({
						file: e.target.files[0],
						canvas: fabricRef as any,
						shapeRef,
						syncShapeInStorage,
					});
				}}
				handleActiveElement={handleActiveElement}
			/>

			<div className="flex h-full flex-row bg-secondary-gray">
				<LeftSidebar allShapes={Array.from(canvasObjects || [])} />
				<Live canvasRef={canvasRef} />
				<RightSidebar
					elementAttributes={elementAttributes}
					setElementAttributes={setElementAttributes}
					fabricRef={fabricRef}
					isEditingRef={isEditingRef}
					activeObjectRef={activeObjectRef}
					syncShapeInStorage={syncShapeInStorage}
				/>
			</div>
		</main>
	);
}
