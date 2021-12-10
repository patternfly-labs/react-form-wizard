import { useEffect, useState } from 'react'
import YAML from 'yaml'

const color = {
    background: 'rgb(21, 21, 21)',
    divider: 'rgb(212, 212, 212)',
    colon: 'rgb(212, 212, 212)',
    variable: 'rgb(115, 188, 247)',
    value: 'rgb(240, 171, 0)',
}

export function YamlToObject(yaml: string) {
    try {
        return YAML.parse(yaml, { prettyErrors: true })
    } catch {
        try {
            return YAML.parseAllDocuments(yaml, { prettyErrors: true })
        } catch {
            return {}
        }
    }
}

export function ObjectToYaml(data: any) {
    if (Array.isArray(data)) {
        return data.map((doc) => YAML.stringify(doc)).join('---\n')
    } else {
        return YAML.stringify(data)
    }
}

export function YamlEditor(props: { data: any; setData?: (data: any) => void }) {
    const [hasFocus, setHasFocus] = useState(false)
    const [, setError] = useState('')
    const [errorLine, setErrorLine] = useState(-1)
    const [yaml, setYaml] = useState(() => {
        return ObjectToYaml(props.data) ?? ''
    })
    useEffect(() => {
        if (!hasFocus) {
            setYaml(ObjectToYaml(props.data))
            setError('')
            setErrorLine(-1)
        }
    }, [props.data, hasFocus])

    return (
        <pre
            style={{ position: 'relative', height: '100%', width: '100%', padding: '24px', backgroundColor: color.background }}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
        >
            <small>
                {yaml.split('\n').map((line, index) => {
                    const backgroundColor = index === errorLine ? '#F203' : undefined
                    if (line === '---') {
                        return (
                            <div key={index} style={{ color: color.divider, backgroundColor }}>
                                {line}
                            </div>
                        )
                    }
                    const parts = line.split(':')
                    if (parts[0] === '') return <div key={index}>&nbsp;</div>
                    if (parts.length === 1) {
                        return (
                            <div key={index} style={{ color: color.variable, backgroundColor }}>
                                {parts[0]}
                            </div>
                        )
                    }
                    return (
                        <div key={index} style={{ color: color.variable, backgroundColor }}>
                            {parts[0]}
                            <span style={{ color: color.colon }}>:</span>
                            <span style={{ color: color.value }}>{parts.slice(1).join(':')}</span>
                        </div>
                    )
                })}
                <textarea
                    id="yaml-editor"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        opacity: 0.5,
                        margin: '0 -34 -24 0',
                        padding: 24,
                        border: 0,
                        backgroundColor: 'transparent',
                        whiteSpace: 'pre',
                        overflowWrap: 'normal',
                        overflowX: 'hidden',
                        overflowY: 'hidden',
                        color: 'transparent',
                        caretColor: 'white',
                        resize: 'none',
                    }}
                    value={yaml}
                    onChange={(e) => {
                        if (!e.target.value) {
                            setYaml('')
                            props.setData?.({})
                        } else {
                            setYaml(e.target.value)
                            try {
                                const data = YamlToObject(e.target.value)
                                props.setData?.(data)
                                setError('')
                                setErrorLine(-1)
                            } catch (err: any) {
                                let message: string = err.message ?? 'Unkown error'
                                const index = message.indexOf('at line')
                                if (index !== -1) {
                                    let lineString = message.substring(index).split(' ')[2]
                                    lineString = lineString.slice(0, lineString.length - 1)
                                    const line = Number(lineString)
                                    if (Number.isInteger(line)) setErrorLine(line - 1)
                                    message = message.substring(0, index)
                                }
                                setError(message)
                            }
                        }
                    }}
                />
            </small>
        </pre>
    )
}
