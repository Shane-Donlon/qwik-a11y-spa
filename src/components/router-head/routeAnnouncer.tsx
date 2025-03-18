import { component$, $, useOnDocument, useSignal, } from '@builder.io/qwik';
import { useDocumentHead } from '@builder.io/qwik-city';



export const RouteAnnouncer = component$(() => {
    const isSpa = useSignal<boolean>(false);
    const doc = useDocumentHead();

    useOnDocument("qsymbol", $((e) => {
        console.log("Event received", e.detail.symbol);
        const isSpaEvent = e.detail.symbol.includes("spaInit_event") || e.detail.symbol.includes("s_9KRx0IOCHt8");
        if (isSpaEvent) {
            isSpa.value = true;
        }

    }))

    return (
        <>
            {isSpa.value ? "true" : "false"}
            {isSpa.value && <div role='status'>The current page is {doc.title}</div>}
        </>
    );
});