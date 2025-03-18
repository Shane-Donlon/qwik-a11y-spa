import { component$, $, useOnDocument, useSignal, } from '@builder.io/qwik';
import { useDocumentHead } from '@builder.io/qwik-city';



export const RouteAnnouncer = component$(() => {
    const isSpa = useSignal<boolean>(false);
    const doc = useDocumentHead();

    useOnDocument("qsymbol", $((e) => {

        const isSpaEvent = e.detail.symbol.includes("spaInit_event");
        if (isSpaEvent) {
            isSpa.value = true;

        }

    }))

    return (
        <>
            {isSpa.value && <div role='status'>The current page is {doc.title}</div>}
        </>
    );
});