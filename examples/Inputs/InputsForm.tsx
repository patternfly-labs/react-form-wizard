import {
    FormWizardCheckbox,
    FormWizardPage,
    FormWizardRadio,
    FormWizardRadioGroup,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextInput,
    FormWizardTile,
    FormWizardTiles,
} from '../../src'

export function InputsForm() {
    return (
        <FormWizardPage
            title="Inputs wizard"
            description="Example wizard showing inputs examples"
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Inputs' }]}
        >
            <FormWizardStep label="Text Input">
                <FormWizardTextInput id="text-input" label="Text input" required />
            </FormWizardStep>

            <FormWizardStep label="Select">
                <FormWizardSelect id="select" label="Select" options={['Option 1', 'Option 2']} />
                <FormWizardSelect id="select" label="Select" options={['Option 1', 'Option 2']} required />
            </FormWizardStep>

            <FormWizardStep label="Tiles">
                <FormWizardTiles id="tiles" path="tile" label="Tiles" required>
                    <FormWizardTile id="tile1" value="tile1" label="Tile 1" />
                    <FormWizardTile id="tile2" value="tile2" label="Tile 2" />
                    <FormWizardTile id="tile3" value="tile3" label="Tile 3" />
                </FormWizardTiles>
            </FormWizardStep>

            <FormWizardStep label="Radio">
                <FormWizardRadioGroup id="radio" path="radio" label="Radio" required>
                    <FormWizardRadio id="radio-1" label="Radio 1" value="radio-1" description="Radio 1 description" />
                    <FormWizardRadio id="radio-2" label="Radio 2" value="radio-2" description="Radio 2 description" />
                </FormWizardRadioGroup>
            </FormWizardStep>

            <FormWizardStep label="Checkbox">
                <FormWizardCheckbox id="checkbox" label="Checkbox" helperText="Checkbox helper text." />
                <FormWizardCheckbox id="checkbox-2" label="Checkbox" helperText="Checkbox helper text." />
            </FormWizardStep>
        </FormWizardPage>
    )
}
