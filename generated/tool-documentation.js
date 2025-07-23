export const generatedToolDocumentation = {};
// Merge with manually maintained documentation
export function mergeDocumentation(manual, generated) {
    const merged = { ...generated };
    // Manual documentation takes precedence
    Object.entries(manual).forEach(([tool, doc]) => {
        merged[tool] = doc;
    });
    return merged;
}
