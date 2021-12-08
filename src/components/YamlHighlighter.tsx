import { useEffect, useState } from 'react'

const color = {
    background: 'rgb(33, 36, 39)',
    divider: '#a0a', // '#a0a'
    colon: '#789', // '#999'
    variable: '#29f', // '#04c'
    value: '#f80', // '#c50'
}

export function YamlHighlighter(props: { yaml: string; setData: (data: any) => void }) {
    const [yaml, setYaml] = useState(props.yaml)
    useEffect(() => {
        setYaml(props.yaml)
    }, [props.yaml])
    return (
        <pre style={{ position: 'relative', height: '100%', width: '100%', padding: 24, backgroundColor: color.background }}>
            <small>
                {yaml.split('\n').map((line, index) => {
                    if (line === '---') {
                        return (
                            <div key={index} style={{ color: color.divider }}>
                                {line}
                            </div>
                        )
                    }
                    const parts = line.split(':')
                    if (parts[0] === '') return <div key={index} />
                    if (parts.length === 1) {
                        return (
                            <div key={index} style={{ color: color.variable }}>
                                {parts[0]}
                            </div>
                        )
                    }
                    return (
                        <div key={index} style={{ color: color.variable }}>
                            {parts[0]}
                            <span style={{ color: color.colon }}>:</span>
                            <span style={{ color: color.value }}>{parts[1]}</span>
                        </div>
                    )
                })}
                {/* <textarea
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        opacity: 0.5,
                        margin: '0 -34 -24 0',
                        padding: 0,
                        border: 0,
                        backgroundColor: 'transparent',
                        whiteSpace: 'pre',
                        overflowWrap: 'normal',
                        overflowX: 'hidden',
                        color: 'transparent',
                        caretColor: 'black',
                    }}
                    value={yaml}
                    onChange={(e) => {
                        try {
                            setYaml(e.target.value)
                            const data = YAML.parse(e.target.value)
                            props.setData(data)
                        } catch {
                            // DO NOTHING
                        }
                    }}
                /> */}
            </small>
        </pre>
    )
}
