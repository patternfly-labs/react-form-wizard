import { RouteE } from '../Routes'

export async function onSubmit(data: unknown) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert(JSON.stringify(data, null, 2))
    return Promise.reject(new Error('No backend connected'))
}

export function onCancel(history: { push: (location: string) => void }) {
    history.push(`./${RouteE.Wizards}`)
}
