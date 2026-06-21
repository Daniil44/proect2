
export function validateUsername(value) {
    if (typeof value !== "string") {
        return false;
    }

    if (value.length < 3) {
        return false;
    }

    if (value.length > 25) {
        return false;
    }

    return /^[a-zA-Z0-9_]+$/.test(value);
}


export function validateMessage(value) {
    if (typeof value !== "string") {
        return false;
    }

    if (value.length < 1) {
        return false;
    }

    return value.length <= 200;
}