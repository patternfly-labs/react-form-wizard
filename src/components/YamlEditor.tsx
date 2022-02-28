import { Button } from '@patternfly/react-core'
import { CheckIcon, CopyIcon } from '@patternfly/react-icons'
import { useEffect, useState } from 'react'
import YAML from 'yaml'

const color = {
    background: 'rgb(21, 21, 21)',
    divider: 'rgb(212, 212, 212)',
    colon: 'rgb(212, 212, 212)',
    variable: 'rgb(115, 188, 247)',
    value: 'rgb(240, 171, 0)',
}

export function YamlToObject(yaml: string, isYamlArray?: boolean) {
    if (isYamlArray === true) {
        return YAML.parseAllDocuments(yaml, { prettyErrors: true }).map((doc) => doc.toJSON())
    } else if (isYamlArray === false) {
        return YAML.parse(yaml, { prettyErrors: true })
    }
    try {
        return YAML.parse(yaml, { prettyErrors: true })
    } catch {
        return YAML.parseAllDocuments(yaml, { prettyErrors: true }).map((doc) => doc.toJSON())
    }
}

export function ObjectToYaml(data: any, isYamlArray: boolean) {
    if (isYamlArray) {
        return (data as unknown[]).map((doc) => YAML.stringify(doc)).join('---\n')
    } else {
        return YAML.stringify(data)
    }
}

export function YamlEditor(props: { data: any; setData?: (data: any) => void; isYamlArray: boolean }) {
    const [hasFocus, setHasFocus] = useState(false)
    const [, setError] = useState('')
    const [errorLine, setErrorLine] = useState(-1)
    const [yaml, setYaml] = useState(() => {
        return ObjectToYaml(props.data, props.isYamlArray) ?? ''
    })
    useEffect(() => {
        if (!hasFocus) {
            setYaml(ObjectToYaml(props.data, props.isYamlArray))
            setError('')
            setErrorLine(-1)
        }
    }, [props.data, hasFocus, props.isYamlArray])
    const [copied, setCopied] = useState(false)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, maxHeight: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    borderBottom: 'thin solid #ffffff30',
                    justifyContent: 'end',
                    backgroundColor: '#ffffff18',
                    color: 'white',
                    alignItems: 'center',
                }}
            >
                <Button
                    variant="plain"
                    onClick={() => {
                        void navigator.clipboard.writeText(yaml)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                    }}
                    tabIndex={-1}
                >
                    {copied ? <CheckIcon color="var(--pf-global--success-color--100)" /> : <CopyIcon color="white" />}
                </Button>
            </div>
            <div style={{ display: 'flex', flexGrow: 1, overflow: 'auto' }}>
                <pre
                    style={{ display: 'flex', flexGrow: 1, justifySelf: 'stretch', position: 'relative', padding: 24 }}
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
                                        const data = YamlToObject(e.target.value, props.isYamlArray)
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
            </div>
        </div>
    )
}
