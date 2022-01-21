import { useHistory } from 'react-router-dom'
import {
    ArrayInput,
    Checkbox as Checkbox,
    Radio as Radio,
    RadioGroup as RadioGroup,
    Select as Select,
    Tile as Tile,
    KeyValue,
    LabelsInput as Labels,
    StringsInput,
    TextArea,
    TextInput as TextInput,
    Tiles as Tiles,
} from '../../src'
import { Section } from '../../src/Section'
import { Step } from '../../src/Step'
import { WizardPage } from '../../src/WizardPage'

export function InputsWizard() {
    const history = useHistory()
    return (
        <WizardPage title="Inputs" onSubmit={() => Promise.resolve()} onCancel={() => history.push('.')}>
            <Step label="Text Input">
                <Section label="Text Input">
                    <TextInput label="Text input" />
                    <TextInput label="Text input required" required />
                    <TextInput label="Text input secret" secret />
                    <TextInput label="Text input hidden" hidden={() => true} />
                </Section>
            </Step>

            <Step label="Text Area">
                <Section label="Text Area">
                    <TextArea label="Text area" />
                    <TextArea label="Text area required" required />
                    <TextArea label="Text area secret" secret />
                    <TextArea label="Text area hidden" hidden={() => true} />
                </Section>
            </Step>

            <Step label="Select">
                <Section label="Select">
                    <Select label="Select" options={['Option 1', 'Option 2']} />
                    <Select label="Select required" options={['Option 1', 'Option 2']} required />
                    <Select label="Select hidden" options={['Option 1', 'Option 2']} required hidden={() => true} />
                </Section>
            </Step>

            <Step label="Tiles">
                <Section label="Tiles">
                    <Tiles id="tiles" path="tile" label="Tiles">
                        <Tile id="tile1" value="tile1" label="Tile 1" />
                        <Tile id="tile2" value="tile2" label="Tile 2" />
                        <Tile id="tile3" value="tile3" label="Tile 3" />
                    </Tiles>
                </Section>
            </Step>

            <Step label="Radio">
                <Section label="Radio">
                    <RadioGroup id="radio0" path="radio" label="Radio">
                        <Radio id="radio-1" label="Radio 1" value="radio-1" />
                        <Radio id="radio-2" label="Radio 2" value="radio-2" />
                    </RadioGroup>
                    <RadioGroup id="radio1" path="radio1" label="Radio with sub-inputs">
                        <Radio id="radio-1" label="Radio 1" value="radio-3">
                            <TextInput label="Name" required />
                        </Radio>
                        <Radio id="radio-2" label="Radio 2" value="radio-4">
                            <TextInput label="Name" required />
                        </Radio>
                    </RadioGroup>
                    <RadioGroup id="radio2" path="radio2" label="Radio with descriptions">
                        <Radio id="radio-1" label="Radio 1" value="radio-5" description="Radio 1 description" />
                        <Radio id="radio-2" label="Radio 2" value="radio-6" description="Radio 2 description" />
                    </RadioGroup>
                    <RadioGroup id="radio3" path="radio3" label="Radio with descriptions and sub-inputs">
                        <Radio id="radio-1" label="Radio 1" value="radio-7" description="Radio 1 description">
                            <TextInput label="Name" required />
                        </Radio>
                        <Radio id="radio-2" label="Radio 2" value="radio-8" description="Radio 2 description">
                            <TextInput label="Name" required />
                        </Radio>
                    </RadioGroup>
                </Section>
            </Step>

            <Step label="Checkbox">
                <Section label="Checkbox">
                    <Checkbox id="checkbox-1" label="Checkbox without description" />
                    <Checkbox id="checkbox-2" label="Checkbox without description with sub-inputs">
                        <TextInput label="Name" required />
                    </Checkbox>
                    <Checkbox id="checkbox-3" label="Checkbox with description" helperText="Checkbox description." />
                    <Checkbox id="checkbox-4" label="Checkbox with description with sub-inputs" helperText="Checkbox description.">
                        <TextInput label="Name" required />
                    </Checkbox>
                    <Checkbox id="checkbox-4" label="Checkbox hidden" hidden={() => true} />
                </Section>
            </Step>

            <Step label="Labels">
                <Section label="Labels">
                    <Labels id="labels" path="labels" label="Labels" />
                </Section>
            </Step>

            <Step label="Key Value">
                <Section label="Key Value">
                    <KeyValue id="key-values" path="key-values" label="Key Value" />
                </Section>
            </Step>

            <Step label="Strings Input">
                <Section label="Strings Input">
                    <StringsInput id="string" path="strings" label="Strings" />
                </Section>
            </Step>

            <Step label="Array Input">
                <Section label="Array Input">
                    <ArrayInput
                        id="resources"
                        label="Resources"
                        path="resources"
                        placeholder="Add resource"
                        collapsedContent="metadata.name"
                    >
                        <TextInput label="Name" path="metadata.name" required />
                        <Select label="Namespace" path="metadata.namespace" required options={['namespace-1', 'namespace-2']} />
                        <KeyValue id="labels" path="metadata.labels" label="Labels" />
                        <KeyValue id="labels" path="metadata.annotations" label="Annotations" />
                    </ArrayInput>
                </Section>
            </Step>

            <Step label="Section">
                <Section label="Section 1">
                    <TextInput label="Text 1" required />
                    <TextInput label="Text 2" />
                </Section>
                <Section label="Section 2">
                    <TextInput label="Text 3" required />
                    <TextInput label="Text 4" />
                </Section>
            </Step>
        </WizardPage>
    )
}
