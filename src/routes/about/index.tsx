import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
    return (
        <>
            <h1>Hi 👋</h1>
            <div>
                <p>this is the about page</p>
                Can't wait to see what you build with qwik!
                <br />
                Happy coding.
            </div>
        </>
    );
});

export const head: DocumentHead = {
    title: "about page",
    meta: [
        {
            name: "description",
            content: "Qwik site description",
        },
    ],
};
