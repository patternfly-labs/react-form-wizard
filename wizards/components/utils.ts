export async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return Promise.reject(new Error('No backend connected'))
}

export function onCancel(history: { push: (location: string) => void }) {
    history.push('./?route=wizards')
}
