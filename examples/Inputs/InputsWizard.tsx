import {
    FormWizardArrayInput,
    FormWizardCheckbox as Checkbox,
    FormWizardKeyValue,
    FormWizardLabels as Labels,
    FormWizardPage as Wizard,
    FormWizardRadio as Radio,
    FormWizardRadioGroup as RadioGroup,
    FormWizardSection as Section,
    FormWizardSelect as Select,
    FormWizardStep as Step,
    FormWizardTextInput as TextInput,
    FormWizardTile as Tile,
    FormWizardTiles as Tiles,
} from '../../src'

export function InputsWizard() {
    return (
        <Wizard
            title="Inputs wizard"
            description="Example wizard showing inputs examples"
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Inputs' }]}
        >
            <Step label="Text Input">
                <Section label="Text input examples">
                    <TextInput id="text-input" label="Text input" required />
                </Section>
            </Step>

            <Step label="Select">
                <Section label="Select input examples">
                    <Select id="select" label="Select" options={['Option 1', 'Option 2']} />
                    <Select id="select" label="Select" options={['Option 1', 'Option 2']} required />
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
                <Section label="Radio input examples">
                    <RadioGroup id="radio" path="radio" label="Radio" required>
                        <Radio id="radio-1" label="Radio 1" value="radio-1" description="Radio 1 description" />
                        <Radio id="radio-2" label="Radio 2" value="radio-2" description="Radio 2 description" />
                    </RadioGroup>
                </Section>
            </Step>

            <Step label="Checkbox">
                <Section label="Checkbox input examples">
                    <Checkbox id="checkbox" label="Checkbox" helperText="Checkbox helper text." />
                    <Checkbox id="checkbox-2" label="Checkbox" helperText="Checkbox helper text." />
                </Section>
            </Step>

            <Step label="Labels">
                <Section label="Label input example">
                    <Labels id="labels" label="Labels" />
                </Section>
            </Step>

            <Step label="Key-value pairs">
                <Section label="Key value input example">
                    <FormWizardKeyValue id="key-values" label="Key vaue pairs" placeholder="Add key value pair" />
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
