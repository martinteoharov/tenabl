import Noty from 'noty';
import "noty/lib/noty.css";
import "noty/lib/themes/mint.css";

export interface Options {
    text: string;
    timeout?: number;
    type?: "success" | "alert" | "error" | "warning";
}

export const spawnNotification = (opts: Options) => {
    const noty = new Noty({
        timeout: opts.timeout || 1000,
        type: opts.type || "success",
        text: opts.text
    });

    noty.show();
}
