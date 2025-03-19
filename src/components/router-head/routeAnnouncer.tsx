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
				const a = document.querySelector(
					"[data-qwik-route-announcer]",
				) as HTMLElement;
				if (a) {
					a.setAttribute("tabindex", "1");
					a.focus();
					a.removeAttribute("tabindex");
				}
			}
		});
	});
	return (
		<>
			{isSpa.value && (
				<div role="status" aria-atomic="true" data-qwik-route-announcer>
					Route Change - the current page is {docSignal.value ||
						"document"}{" "}
				</div>
			)}
		</>
	);
});
