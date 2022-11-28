import { useEffect } from "react";

// Handle clicking outside of the dialog
const closeOnOutside = (ref, closeDialog) => {
    useEffect(() => {
        const clickedOutside = (e: Event) => {
            if (ref.current && !ref.current.contains(e.target)) {
                closeDialog();
            }
        }
        document.addEventListener("mousedown", clickedOutside);

        // cleanup
        return () =>
            document.removeEventListener("mousedown", clickedOutside);

    }, [ref]);
}

export default closeOnOutside;