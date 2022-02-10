import { useHistory } from 'react-router-dom'
import {
    ArrayInput,
    Checkbox,
    KeyValue,
    Radio,
    RadioGroup,
    Section,
    Select,
    Step,
    StringsInput,
    TableSelect,
    TextArea,
    TextInput,
    Tile,
    Tiles,
    WizardPage,
} from '../../src'
import { onCancel, onSubmit } from '../common/utils'

export function InputsWizard() {
    const history = useHistory()
    return (
        <WizardPage title="Inputs" onSubmit={onSubmit} onCancel={() => onCancel(history)}>
            <Step label="Text Input" id="text-input">
                <Section label="Text Input">
                    <TextInput label="Text input" path="textInput.text" />
                    <TextInput label="Text input required" path="textInput.required" required />
                    <TextInput label="Text input secret" path="textInput.secret" secret />
                </Section>
            </Step>

            <Step label="Text Area" id="text-area">
                <Section label="Text Area">
                    <TextArea label="Text area" path="textArea.text" />
                    <TextArea label="Text area required" path="textArea.required" required />
                    <TextArea label="Text area secret" path="textArea.secret" secret />
                </Section>
            </Step>

            <Step label="Select" id="select">
                <Section label="Select">
                    <Select label="Select" path="select.value" options={['Option 1', 'Option 2']} />
                    <Select label="Select required" path="select.required" options={['Option 1', 'Option 2']} required />
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

            <Step label="Radio" id="radio-step">
                <Section label="Radio">
                    <RadioGroup id="group-1" path="radios.group1.value" label="Radio">
                        <Radio id="radio-1" label="Radio 1" value="radio-1" />
                        <Radio id="radio-2" label="Radio 2" value="radio-2" />
                    </RadioGroup>
                    <RadioGroup id="group-2" path="radios.group2.value" label="Radio with sub-inputs">
                        <Radio id="radio-1" label="Radio 1" value="radio-1">
                            <TextInput label="Name" path="radios.group2.name" required />
                        </Radio>
                        <Radio id="radio-2" label="Radio 2" value="radio-2">
                            <TextInput label="Name" path="radios.group2.name" required />
                        </Radio>
                    </RadioGroup>
                    <RadioGroup id="group-3" path="radios.group3.value" label="Radio with descriptions" helperText="Description goes here.">
                        <Radio id="radio-1" label="Radio 1" value="radio-1" description="Radio 1 description" />
                        <Radio id="radio-2" label="Radio 2" value="radio-2" description="Radio 2 description" />
                    </RadioGroup>
                    <RadioGroup
                        id="group-4"
                        path="radios.group4.value"
                        label="Radio with descriptions and sub-inputs"
                        helperText="Description goes here."
                    >
                        <Radio id="radio-1" label="Radio 1" value="radio-1" description="Radio 1 description">
                            <TextInput label="Name" path="radios.group4.name" required />
                        </Radio>
                        <Radio id="radio-2" label="Radio 2" value="radio-2" description="Radio 2 description">
                            <TextInput label="Name" path="radios.group4.name" required />
                        </Radio>
                    </RadioGroup>
                    <RadioGroup id="group-5" path="radios.group5.value" label="Radio (Required)" required>
                        <Radio id="radio-1" label="Radio 1" value="radio-1" />
                        <Radio id="radio-2" label="Radio 2" value="radio-2" />
                    </RadioGroup>
                </Section>
            </Step>

            <Step label="Checkbox" id="checkbox-step">
                <Section label="Checkbox">
                    <Checkbox label="Checkbox" path="checkboxes.checkbox1.value" id="checkbox-1" />
                    <Checkbox label="Checkbox with inputs" path="checkboxes.checkbox2.value" id="checkbox-2">
                        <TextInput label="Text input" path="checkboxes.checkbox2.textInput" required id="checkbox-2-text" />
                    </Checkbox>
                    <Checkbox
                        label="Checkbox with description"
                        helperText="Description goes here."
                        path="checkboxes.checkbox3.value"
                        id="checkbox-3"
                    />
                    <Checkbox
                        label="Checkbox with both"
                        path="checkboxes.checkbox4.value"
                        helperText="Description goes here."
                        id="checkbox-4"
                    >
                        <TextInput label="Text input" path="checkboxes.checkbox4.textInput" required />
                    </Checkbox>
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
                        sortable
                    >
                        <TextInput label="Name" path="metadata.name" required />
                        <Select label="Namespace" path="metadata.namespace" required options={['namespace-1', 'namespace-2']} />
                        <KeyValue id="labels" path="metadata.labels" label="Labels" />
                        <KeyValue id="labels" path="metadata.annotations" label="Annotations" />
                    </ArrayInput>
                </Section>
            </Step>

            <Step label="Table Select" id="table-select">
                <Section label="Table Select" description="Table select is used when many selections can be made from many options.">
                    <TableSelect
                        id="string"
                        path="tableSelect"
                        label="Strings"
                        columns={[{ name: 'Name', cellFn: (item: { name: string }) => item.name }]}
                        items={new Array(100).fill(0).map((_, i) => ({ name: `Item ${i + 1}` }))}
                        itemToValue={(item: unknown) => (item as any).name}
                        valueMatchesItem={(value: unknown, item: { name: string }) => value === item.name}
                        emptyMessage="Nothing available for selection."
                    />
                </Section>
            </Step>

            <Step label="Section" id="section-step">
                <Section label="Section 1 with description" description="Description goes here">
                    <TextInput label="Text 1" path="section1.text1" id="text-1" required />
                    <TextInput label="Text 2" path="section1.text2" id="text-2" />
                </Section>
                <Section label="Section 2 (Collapsable)" collapsable>
                    <TextInput label="Text 3" path="section2.text3" id="text-3" required />
                    <TextInput label="Text 4" path="section2.text4" id="text-4" />
                </Section>
                <Section label="Hide Settings">
                    <Checkbox label="Hide section" path="hideSection" id="hide-section" />
                </Section>
                <Section
                    label="Section 3 (Hideable)"
                    description="This section is hidden using a function to determine if it should be hidden."
                    hidden={(item) => item.hideSection}
                >
                    <TextInput label="Text input" path="hideableSection.text" required />
                </Section>
            </Step>

            <Step label="Hidden" id="hidden-step">
                <Section label="Hide Settings" description="This sets a flag which inputs are using to hide themselves.">
                    <Checkbox label="Show hidden" path="showHidden" id="show-hidden" />
                </Section>

                <Section label="Automatically hidden" description="A section will automatically hide itelf if all child inputs are hidden.">
                    <TextInput label="Text input hidden" path="hidden.textInput" hidden={(item) => !item.showHidden} required />
                    <TextArea label="Text area hidden" path="hidden.textArea" hidden={(item) => !item.showHidden} required />
                    <Select
                        label="Select hidden"
                        path="hidden.select"
                        options={['Option 1', 'Option 2']}
                        required
                        hidden={(item) => !item.showHidden}
                    />
                    <RadioGroup id="group-hidden" path="hidden.radio" label="Radio (Required)" required hidden={(item) => !item.showHidden}>
                        <Radio id="radio-1" label="Radio 1" value="radio-1" />
                        <Radio id="radio-2" label="Radio 2" value="radio-2" />
                    </RadioGroup>
                    <Checkbox label="Checkbox conditionally hidden" path="hidden.checkbox" hidden={(item) => !item.showHidden} />
                </Section>
            </Step>
        </WizardPage>
    )
}
