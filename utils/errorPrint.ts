import { Alert } from "react-native"

export const errorPrint = (title: string, e: unknown) => {
    if (e instanceof Error ||
        e instanceof TypeError ||
        e instanceof EvalError ||
        e instanceof RangeError
    ) {
        Alert.alert(title, e.stack)
        throw e;
    }
    else {
        Alert.alert(title, JSON.stringify(e, null))
        throw e;
    }

}