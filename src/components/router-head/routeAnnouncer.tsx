import {
	component$,
	$,
	useOnDocument,
	useSignal,
	useTask$,
	isBrowser,
} from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

function changeFocusToPageTop() {
	const div = document.createElement("div");
	div.setAttribute(
		"style",
		"height: 0px; overflow: hidden; position: absolute; top: 0;",
	);
	div.setAttribute("tabindex", "1");
	document.body.prepend(div);
	div.focus();
	div.remove();
}

export const RouteAnnouncer = component$(() => {
	const isSpa = useSignal<boolean>(false);
	const loc = useLocation();
	const doc = useDocumentHead().title;
	const docSignal = useSignal<string | null>(doc);
	useOnDocument(
		"qsymbol",
		$((e) => {
			const isSpaEvent =
				e.detail.symbol.includes("spaInit_event") ||
				e.detail.symbol.includes("s_9KRx0IOCHt8");
			if (isSpaEvent) {
				isSpa.value = true;
				changeFocusToPageTop();
			}
		}),
	);

	useTask$(({ track }) => {
		track(() => {
			doc;
			loc;
			docSignal.value = null;
			if (doc) {
				docSignal.value = doc;
			}

			// screen readers read out the page title, but changing the title to "Home" for "/" seems a bit better experience
			if (loc.url.pathname === "/") {
				docSignal.value = "home";
			}
			if (isBrowser) {
				changeFocusToPageTop();
			}
		});
	});
	return (
		<>
			{isSpa.value && (
				<div
					role="alert"
					aria-atomic="true"
					aria-live="assertive"
					aria-keyshortcuts="ctrl+home"
					style={{
						height: "0px",
						overflow: "hidden",
						position: "absolute",
						top: 0,
					}}
					data-qwik-route-announcer
				>
					{/* I would prefer to say "route change the current page is ${page title}" but the below is what happens on windows OS*/}
					{/* note if no title is found the screen reader just says "document", but I have changed it slightly */}
					{docSignal.value
						? `${docSignal.value} has finished loading - route changed`
						: "route changed - page has finished loading"}
				</div>
			)}
		</>
	);
});
