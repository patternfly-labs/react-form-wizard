import { TextInput } from '..'
import { Input } from '../inputs/Input'
import { Section } from './Section'
import { Step } from './Step'
import { Wizard } from './Wizard'

export function Test() {
    return (
        <Wizard>
            <Step label="Step 1">
                <Section label="Section 1.1">
                    <Input label="Name" path="name" />
                    <Input label="Namespace" path="namespace" />
                </Section>
                <Section label="Section 1.2">
                    <Input label="Text 1" path="text1" />
                    <Input label="Text 2" path="text2" />
                    <TextInput id="a" label="j" required />
                </Section>
            </Step>
            <Step label="Step 2">
                <Section label="Section 2.1">
                    <Input label="Text 3" path="text3" />
                    <Input label="Text 4" path="text4" />
                </Section>
            </Step>
            <Step label="Step 3">
                <Section label="Section 3.1">
                    <Input label="Text 3.1.1" path="text5" />
                    <Input label="Text 3.1.2" path="text6" />
                </Section>
            </Step>
        </Wizard>
    )
}
