# Patternfly React Form Wizard

A Patternfly react wizard framework.

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
<FormWizardPage title="Create deployment">
   <FormWizardStep label="Metadata">
      <FormWizardSection label="Details" prompt="Enter the details">
          <FormWizardTextInput
              id="name"
              label="Name"
              placeholder="Enter name"
              required
          />
          <FormWizardSelect
              id="namespace"
              label="Namespace"
              options={['default']}
              placeholder="Select namespace"
              required
          />
      </FormWizardSection>
  </FormWizardStep>
</FormWizardPage>
```
