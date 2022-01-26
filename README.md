# PatternFly Labs React Form Wizard [![GitHub package.json version](https://img.shields.io/github/package-json/v/patternfly-labs/react-form-wizard)](https://www.npmjs.com/package/@patternfly-labs/react-form-wizard)

An opinionated framework for wizards using [PatternFly](https://www.patternfly.org/).

[Demo](https://patternfly-labs.github.io/react-form-wizard/)

## Installation

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

A wizard contains steps which contain sections which contain inputs.

```tsx
import { WizardPage, Step, Section, TextInput, Select } from '@patternfly-labs/react-form-wizard'

function MyWizardPage() {
   return (
      <WizardPage title="My Wizard">
         <Step label="Details">
            <Section label="Details">
               <TextInput label="Name" path="name" required />
               <Select label="Namespace" path="namespace" options={['default', 'namespace-1']} />
            </Section>
         </Step>
      </WizardPage>
   )
}
```

### Item Context

The wizard works by setting an item context which inputs use as a data source.
Inputs then get value or set value in the item context using [path](https://github.com/jonschlinkert/set-value#object-paths) notation.

```xml
<TextInput label="Name" path="name" />
```

Some inputs can change the item context, such as the `ArrayInput`.

```xml
<ArrayInput path="resources" placeholder="Add new resource">
   <TextInput label="Name" path="metadata.name" required />
   <Select label="Namespace" path="metadata.namespace" options={['default']} required/>
</ArrayInput>
```

### Working with an array of items

The root data can either be an object or an array of objects.
When working with an array of objects an`ItemSelector` can be used to set the item context specific item.

```xml
<ItemSelector selectKey="kind" selectValue="Application">
   <TextInput label="Name" path="metadata.name" required />
   <Select label="Namespace" path="metadata.namespace" options={['default']} required/>
</ItemSelector>
```

`ArrayInput` can also be used to work with a subset of items in this case.

```xml
<ArrayInput path={null} filter={(item) => item.kind === 'Subscription'}>
   <TextInput label="Name" path="metadata.name" required />
   <Select label="Namespace" path="metadata.namespace" options={['default']} required/>
</ArrayInput>
```

### Input validation

Input controls take a validation function that validates the controls input. It returns the validation error string if the validation fails.

### Conditional inputs

Input controls take a hidden function that can conditionally hide the control.

### Examples

See the [wizards](https://github.com/patternfly-labs/react-form-wizard/tree/main/wizards) directory for example wizards.

## Development

> If you plan on contributing, please fork the repo and create a pull request using your fork.

1. Clone the repo

   ```
   git clone git@github.com:patternfly-labs/react-form-wizard.git
   ```

2. Install dependencies

   ```
   npm ci
   ```

3. Start the project

   ```
   npm start
   ```
