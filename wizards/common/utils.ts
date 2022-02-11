import { RouteE } from '../Routes'

export async function onSubmit(data: unknown) {
    // eslint-disable-next-line no-console
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return Promise.reject(new Error('No backend connected'))
}

export function onCancel(history: { push: (location: string) => void }) {
    history.push(`./${RouteE.Wizards}`)
}
