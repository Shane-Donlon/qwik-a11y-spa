import {
	component$,
	$,
	useOnDocument,
	useSignal,
	useTask$,
	isBrowser,
} from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

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

				const annoucmentElement = document.querySelector(
					"[data-qwik-route-announcer]",
				) as HTMLElement;

				if (!annoucmentElement) {
					// set focus to the first focusable element
					// this is when moving from MPA to SPA within the same site
					const div = document.createElement("div");
					div.setAttribute(
						"style",
						"height: 0px; overflow: hidden; position: absolute; top: 0;",
					);
					div.setAttribute("tabindex", "1");
					document.body.prepend(div);
					div.focus();
					div.remove();
					return;
				}

				annoucmentElement.setAttribute("tabindex", "1");
				annoucmentElement.focus();
				annoucmentElement.removeAttribute("tabindex");
			}
		}),
	);

	useTask$(({ track }) => {
		track(() => {
			doc;
			loc;
			if (doc) {
				docSignal.value = doc;
			} else {
				docSignal.value = null;
			}
			if (loc.url.pathname === "/") {
				docSignal.value = "home";
			}
			if (isBrowser) {
				const annoucmentElement = document.querySelector(
					"[data-qwik-route-announcer]",
				) as HTMLElement;

				if (annoucmentElement) {
					annoucmentElement.setAttribute("tabindex", "1");
					annoucmentElement.focus();
					annoucmentElement.removeAttribute("tabindex");
					return;
				}

				return;
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
					Route Change - the current page is {docSignal.value ||
						"document"}{" "}
				</div>
			)}
		</>
	);
});
