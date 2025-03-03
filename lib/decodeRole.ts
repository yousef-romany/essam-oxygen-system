/* eslint-disable @typescript-eslint/no-explicit-any */
export function decodeRole(roleArray: any) {
  const uint8Array = new Uint8Array(roleArray);
  const decoder = new TextDecoder("utf-8");
  const decodedString = decoder.decode(uint8Array);

  try {
    // Using eval is dangerous if the input can be tampered with.
    // Ensure that this data is safe before using eval.
    const parsed = eval(decodedString);
    return parsed;
  } catch (e) {
    console.error("Evaluating role data failed:", e);
    return decodedString;
  }
}
