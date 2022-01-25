import { useHistory } from 'react-router-dom'
import { ArrayInput, Checkbox, KeyValue, Radio, RadioGroup, Select, StringsInput, TextArea, TextInput, Tile, Tiles } from '../../src'
import { Section } from '../../src/Section'
import { Step } from '../../src/Step'
import { WizardPage } from '../../src/WizardPage'

export function InputsWizard() {
    const history = useHistory()
    return (
        <WizardPage title="Inputs" onSubmit={() => Promise.resolve()} onCancel={() => history.push('.')}>
            <Step label="Text Input" id="text-input">
                <Section label="Text Input">
                    <TextInput label="Text input" path="textInput.text" />
                    <TextInput label="Text input required" path="textInput.required" required />
                    <TextInput label="Text input secret" path="textInput.secret" secret />
                    <TextInput label="Text input hidden" path="textInput.hidden" hidden={(item) => !item.showHidden} />
                    <Checkbox label="Show hidden" path="showHidden" />
                </Section>
            </Step>

            <Step label="Text Area" id="text-area">
                <Section label="Text Area">
                    <TextArea label="Text area" path="textArea.text" />
                    <TextArea label="Text area required" path="textArea.required" required />
                    <TextArea label="Text area secret" path="textArea.secret" secret />
                    <TextArea label="Text area hidden" path="textArea.hidden" hidden={(item) => !item.showHidden} />
                    <Checkbox label="Show hidden" path="showHidden" />
                </Section>
            </Step>

            <Step label="Select" id="select">
                <Section label="Select">
                    <Select label="Select" path="select.value" options={['Option 1', 'Option 2']} />
                    <Select label="Select required" path="select.required" options={['Option 1', 'Option 2']} required />
                    <Select
                        label="Select hidden"
                        path="select.hidden"
                        options={['Option 1', 'Option 2']}
                        required
                        hidden={(item) => !item.showHidden}
                    />
                    <Checkbox label="Show hidden" path="showHidden" />
                </Section>
            </Step>

            <Step label="Tiles" id="tiles">
                <Section label="Tiles">
                    <Tiles id="tiles" path="tile" label="Tiles">
                        <Tile id="tile1" value="tile1" label="Tile 1" />
                        <Tile id="tile2" value="tile2" label="Tile 2" />
                        <Tile id="tile3" value="tile3" label="Tile 3" />
                    </Tiles>
                </Section>
            </Step>

            <Step label="Radio" id="radio">
                <Section label="Radio">
                    <RadioGroup id="radio0" path="radio" label="Radio">
                        <Radio id="radio-1" label="Radio 1" value="radio-1" />
                        <Radio id="radio-2" label="Radio 2" value="radio-2" />
                    </RadioGroup>
                    <RadioGroup id="radio1" path="radio1" label="Radio with sub-inputs">
                        <Radio id="radio-1" label="Radio 1" value="radio-3">
                            <TextInput label="Name" path="radio1.name" required />
                        </Radio>
                        <Radio id="radio-2" label="Radio 2" value="radio-4">
                            <TextInput label="Name" path="radio2.name" required />
                        </Radio>
                    </RadioGroup>
                    <RadioGroup id="radio2" path="radio2" label="Radio with descriptions">
                        <Radio id="radio-1" label="Radio 1" value="radio-5" description="Radio 1 description" />
                        <Radio id="radio-2" label="Radio 2" value="radio-6" description="Radio 2 description" />
                    </RadioGroup>
                    <RadioGroup id="radio3" path="radio3" label="Radio with descriptions and sub-inputs">
                        <Radio id="radio-1" label="Radio 1" value="radio-7" description="Radio 1 description">
                            <TextInput label="Name" path="radio1.name" required />
                        </Radio>
                        <Radio id="radio-2" label="Radio 2" value="radio-8" description="Radio 2 description">
                            <TextInput label="Name" path="radio1.name" required />
                        </Radio>
                    </RadioGroup>
                </Section>
            </Step>

            <Step label="Checkbox" id="checkbox">
                <Section label="Checkbox">
                    <Checkbox label="Checkbox without description" path="checkbox1" />
                    <Checkbox label="Checkbox without description with sub-inputs" path="checkbox2">
                        <TextInput label="Name" path="checkbox2.name" required />
                    </Checkbox>
                    <Checkbox label="Checkbox with description" helperText="Checkbox description." path="checkbox3" />
                    <Checkbox label="Checkbox with description with sub-inputs" path="checkbox4" helperText="Checkbox description.">
                        <TextInput label="Name" path="checkbox4.name" required />
                    </Checkbox>
                    <Checkbox label="Checkbox hidden" path="checkbox5" hidden={(item) => !item.showHidden} />
                </Section>
            </Step>

            <Step label="Key Value" id="key-value">
                <Section label="Key Value">
                    <KeyValue id="key-values" path="key-values" label="Key Value" />
                </Section>
            </Step>

            <Step label="Strings Input" id="strings-input">
                <Section label="Strings Input">
                    <StringsInput id="string" path="strings" label="Strings" />
                </Section>
            </Step>

            <Step label="Array Input" id="array-input">
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

            <Step label="Section" id="section">
                <Section label="Section 1">
                    <TextInput label="Text 1" path="section1.text1" id="text-1" required />
                    <TextInput label="Text 2" path="section1.text2" id="text-2" />
                </Section>
                <Section label="Section 2 (Collapsable)" collapsable>
                    <TextInput label="Text 3" path="section2.text3" id="text-3" required />
                    <TextInput label="Text 4" path="section2.text4" id="text-4" />
                </Section>
                <Section label="Section 3 (Hideable)" description="This section auto hides if all inputs are hidden.">
                    <TextInput label="Text input hidden" path="textInput.hidden" hidden={(item) => !item.showHidden} />
                </Section>
                <Section
                    label="Section 4 (Hidden)"
                    hidden={(item) => !item.showHidden}
                    description="This section has a hidden function to hide itself and its inputs."
                >
                    <TextInput label="Text input" path="textInput.text" />
                </Section>
                <Checkbox label="Show hidden" path="showHidden" />
            </Step>

            <Step label="Hidden" id="hidden">
                <TextInput label="Text input hidden" path="textInput.hidden" hidden={(item) => !item.showHidden} />
            </Step>
        </WizardPage>
    )
}
