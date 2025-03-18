import { component$, $, useOnDocument, useSignal, } from '@builder.io/qwik';
import { useDocumentHead } from '@builder.io/qwik-city';



export const RouteAnnouncer = component$(() => {
    const isSpa = useSignal<boolean>(false);
    const doc = useDocumentHead();

    useOnDocument("qsymbol", $((e) => {

        const isSpaEvent = e.detail.symbol.includes("spaInit_event");
        if (isSpaEvent) {
            isSpa.value = true;
            console.log("SPA initialized");
        }

    }))

    return (
        <>
            {isSpa.value ? "true" : "false"}
            {isSpa.value && <div role='status'>The current page is {doc.title}</div>}
        </>
    );
});