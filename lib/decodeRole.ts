export function decodeRole(roleArray: any) {
    if (roleArray && Array.isArray(roleArray)) {
        const decoder = new TextDecoder("utf-8");
        const jsonString = decoder.decode(new Uint8Array(roleArray));
        try {
            return JSON.parse(jsonString); // If the role is a JSON string, parse it
        } catch (e) {
            return jsonString; // If not, return the string itself
        }
    }
    return null;
}