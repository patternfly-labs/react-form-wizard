# PatternFly Labs React Form Wizard

A PatternFly React wizard framework.

[Demo](https://patternfly-labs.github.io/react-form-wizard/)

## Overview

### Features

- Input validation
- Conditional hiding/showing of controls and sections
- more

### Example

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

## Development

```
npm ci
npm start
```
