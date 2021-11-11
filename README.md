# PatternFly Labs React Form Wizard

A PatternFly react wizard framework.

[Demo](https://patternfly-labs.github.io/react-form-wizard/)

## Features

- Input validation
- Conditional hiding/showing of controls and sections

## Development setup

```
npm ci
npm start
```

## Example

```
<FormWizardPage title="Example form">
   <FormWizardStep label="Details">
      <FormWizardSection label="Details" prompt="Enter the details">
          <FormWizardTextInput id="name" label="Name" required />
          <FormWizardSelect id="namespace" label="Namespace" options={['default']} required />
      </FormWizardSection>
   </FormWizardStep>
</FormWizardPage>
```
