import { Fragment } from 'react'
import YAML from 'yaml'

export function YamlHighlighter(props: { value: object }) {
    let yaml: string
    if (Array.isArray(props.value)) {
        yaml = props.value.map(YAML.stringify).join('---\n')
    } else {
        yaml = YAML.stringify(props.value)
    }
    return (
        <pre>
            <small>
                {yaml.split('\n').map((line, index) => {
                    if (line === '---') {
                        return (
                            <div key={index} style={{ color: '#a0a' }}>
                                {line}
                            </div>
                        )
                    }
                    const parts = line.split(':')
                    if (parts[0] === '') return <Fragment key={index} />
                    if (parts.length === 1) {
                        return (
                            <div key={index} style={{ color: '#04c' }}>
                                {parts[0]}
                            </div>
                        )
                    }
                    return (
                        <div key={index} style={{ color: '#04c' }}>
                            {parts[0]}
                            <span style={{ color: '#999' }}>:</span>
                            <span style={{ color: '#c50' }}>{parts[1]}</span>
                        </div>
                    )
                })}
                {/* <textarea
                    style={{
                        position: 'absolute',
                        top: 24,
                        left: 34,
                        height: '100%',
                        width: '100%',
                        opacity: 0.5,
                        margin: 0,
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
                    onChange={(e) => setYaml(e.target.value)}
                /> */}
            </small>
        </pre>
    )
}
