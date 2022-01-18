import {
    FormWizardArrayInput,
    FormWizardCheckbox as Checkbox,
    FormWizardKeyValue,
    FormWizardLabels as Labels,
    FormWizardRadio as Radio,
    FormWizardRadioGroup as RadioGroup,
    FormWizardSelect as Select,
    TextArea,
    TextInput as TextInput,
    FormWizardTile as Tile,
    FormWizardTiles as Tiles,
} from '../../src'
import { Section } from '../../src/Section'
import { Step } from '../../src/Step'
import { Wizard } from '../../src/Wizard'

export function Tutorial() {
    return (
        <Wizard title="Tutorial">
            <Step label="TextInput">
                <Section label="TextInput">
                    <TextInput label="TextInput" required />
                    <TextInput label="TextInput secret" required secret />
                    <TextInput label="TextInput hidden" required hidden={() => true} />
                </Section>
            </Step>

            <Step label="TextArea">
                <Section label="TextArea">
                    <TextArea label="TextArea" required />
                    <TextArea label="TextArea secret" required secret />
                    <TextArea label="TextArea hidden" required hidden={() => true} />
                </Section>
            </Step>

            <Step label="Select">
                <Section label="Select">
                    <Select id="select" label="Select" options={['Option 1', 'Option 2']} />
                    <Select id="select" label="Select required" options={['Option 1', 'Option 2']} required />
                    <Select id="select" label="Select hidden" options={['Option 1', 'Option 2']} required hidden={() => true} />
                </Section>
            </Step>

            <Step label="Tiles">
                <Section label="Tile input examples">
                    <Tiles id="tiles" path="tile" label="Tiles" required>
                        <Tile id="tile1" value="tile1" label="Tile 1" />
                        <Tile id="tile2" value="tile2" label="Tile 2" />
                        <Tile id="tile3" value="tile3" label="Tile 3" />
                    </Tiles>
                </Section>
            </Step>

            <Step label="Radio">
                <Section label="Radio">
                    <RadioGroup id="radio0" path="radio" label="Radio" required>
                        <Radio id="radio-1" label="Radio 1" value="radio-1" />
                        <Radio id="radio-2" label="Radio 2" value="radio-2" />
                    </RadioGroup>
                    <RadioGroup id="radio1" path="radio1" label="Radio with sub-inputs" required>
                        <Radio id="radio-1" label="Radio 1" value="radio-3">
                            <TextInput
                                id="text-input"
                                path="text" // test
                                label="Name"
                                required
                            />
                        </Radio>
                        <Radio id="radio-2" label="Radio 2" value="radio-4">
                            <TextInput
                                id="text-input"
                                path="text" // test
                                label="Name"
                                required
                            />
                        </Radio>
                    </RadioGroup>
                    <RadioGroup id="radio2" path="radio2" label="Radio with descriptions" required>
                        <Radio id="radio-1" label="Radio 1" value="radio-5" description="Radio 1 description" />
                        <Radio id="radio-2" label="Radio 2" value="radio-6" description="Radio 2 description" />
                    </RadioGroup>
                    <RadioGroup id="radio3" path="radio3" label="Radio with descriptions and sub-inputs" required>
                        <Radio id="radio-1" label="Radio 1" value="radio-7" description="Radio 1 description">
                            <TextInput
                                id="text-input"
                                path="text" // test
                                label="Name"
                                required
                            />
                        </Radio>
                        <Radio id="radio-2" label="Radio 2" value="radio-8" description="Radio 2 description">
                            <TextInput
                                id="text-input"
                                path="text" // test
                                label="Name"
                                required
                            />
                        </Radio>
                    </RadioGroup>
                </Section>
            </Step>

            <Step label="Checkbox">
                <Section label="Checkbox">
                    <Checkbox id="checkbox-1" label="Checkbox without description" />
                    <Checkbox id="checkbox-2" label="Checkbox without description with sub-inputs">
                        <TextInput
                            id="text-input"
                            path="text" // test
                            label="Name"
                            required
                        />
                    </Checkbox>
                    <Checkbox id="checkbox-3" label="Checkbox with description" helperText="Checkbox description." />
                    <Checkbox id="checkbox-4" label="Checkbox with description with sub-inputs" helperText="Checkbox description.">
                        <TextInput
                            id="text-input"
                            path="text" // test
                            label="Name"
                            required
                        />
                    </Checkbox>
                    <Checkbox id="checkbox-4" label="Checkbox hidden" hidden={() => true} />
                </Section>
            </Step>

            <Step label="Labels">
                <Section label="Label input example">
                    <Labels id="labels" label="Labels" />
                </Section>
            </Step>

            <Step label="Key-value pairs">
                <Section label="Key value input example">
                    <FormWizardKeyValue id="key-values" path="key-values" label="Key vaue pairs" />
                </Section>
            </Step>

            <Step label="Array">
                <Section label="Array input example">
                    <FormWizardArrayInput
                        id="resources"
                        label="Resources"
                        path="resources"
                        placeholder="Add resource"
                        collapsedContent="TODO"
                    >
                        <TextInput id="metadata.name" label="Name" required />
                        <Select id="metadata.namespace" label="Namespace" required options={['namespace-1', 'namespace-2']} />
                        <Labels id="metadata.labels" label="Labels" />
                    </FormWizardArrayInput>
                </Section>
            </Step>
        </Wizard>
    )
}
