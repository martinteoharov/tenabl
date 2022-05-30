import { Variable } from "@lbfalvy/mini-events";
import React from "react";

export function useVariable<T>(variable: Variable<T>): T {
    const [val, setVal] = React.useState<T>(variable.get());
    React.useLayoutEffect(() => variable.changed(setVal), []);
    return val;
}
