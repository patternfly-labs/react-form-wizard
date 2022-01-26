# PatternFly Labs React Form Wizard

[![GitHub package.json version](https://img.shields.io/github/package-json/v/patternfly-labs/react-form-wizard)](https://www.npmjs.com/package/@patternfly-labs/react-form-wizard)

An opinionated framework for wizards powered by PatternFly.

[Demo](https://patternfly-labs.github.io/react-form-wizard/)

## Installation

React Form Wizard is available as an [npm package](https://www.npmjs.com/package/@patternfly-labs/react-form-wizard).

### Install dependencies

#### Using npm

```sh
npm install @patternfly-labs/react-form-wizard @patternfly/react-core @patternfly/react-styles
```

#### Using yarn

```
yarn add @patternfly-labs/react-form-wizard @patternfly/react-core @patternfly/react-styles
```

### Setup Patternfly CSS

Import css from patternfly before importing react-form-wizard.

```typescript
import '@patternfly/react-core/dist/styles/base.css'
import '@patternfly/react-styles/css/components/Wizard/wizard.css'
```

## Concepts

### Wizard structure

A wizard contains steps which contain sections which contain input controls.

```tsx
import '@patternfly/react-core/dist/styles/base.css'

function MyWizardPage(){
   return (
      <WizardPage title="My Wizard">
         <Step label="Details">
            <Section label="Details" prompt="Enter the details">
               <TextInput label="Name" path="name" required />
               <Select label="Namespace" path="namespace" options={['default']} />
            </Section>
         </Step>
      </WizardPage>
   )
}
```

### Data paths

There is one data state for the wizard. It can either be a single object or an array of objects.

Input controls know about the data state and update it using json path dot notation.

```
<TextInput label="Name" path="metadata.name" required />
```

In many cases an array of items need to be edited.
There is a special control for editing arrays of items.

```
<ArrayInput path="resources" placeholder="Add new resource">
   <TextInput label="Name" path="metadata.name" required />
   <Select label="Namespace" path="metadata.namespace" options={['default']} />
</ArrayInput>
```

This allow items to be added and removed from the array.
The controls inside the `ArrayInput` understand the item context they are working with and paths are relative for that item.

### Input validation

Input controls take a validation function that validates the controls input. It returns the validation error string if the validation fails.

### Conditional inputs

Input controls take a hidden function that can conditionally hide the control.

### Examples

See the [wizards](https://github.com/patternfly-labs/react-form-wizard/tree/main/wizards) directory for example wizards.

## Development

1. Clone the repo

   ```
   git clone git@github.com:patternfly-labs/react-form-wizard.git
   ```

   > If you plan on contributing, please fork the repo and create a pull request using your fork.

2. Install dependencies

   ```
   npm ci
   ```

3. Start the project

   ```
   npm start
   ```
