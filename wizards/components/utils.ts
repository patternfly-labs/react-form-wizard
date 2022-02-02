export async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    return Promise.resolve('No backend connected')
}

export function onCancel(history: { push: (location: string) => void }) {
    history.push('./?route=wizards')
}
