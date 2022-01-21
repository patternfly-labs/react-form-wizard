# PatternFly Labs React Form Wizard

A PatternFly React wizard framework.

[![GitHub package.json version](https://img.shields.io/github/package-json/v/patternfly-labs/react-form-wizard)](https://www.npmjs.com/package/@patternfly-labs/react-form-wizard)

[Demo](https://patternfly-labs.github.io/react-form-wizard/)

Patternfly defines how wizards should look and how input validation errors should look. This opinionated framework adds functionality for tying that together focusing on making a easy but powerful developer experience.

## Concepts

### Wizard structure

A wizard contains steps which contain sections which contain input controls.

```
<Wizard title="Example form">
   <Step label="Details">
      <Section label="Details" prompt="Enter the details">
          <TextInput path="name" label="Name" required />
          <Select path="namespace" label="Namespace" options={['default']} />
      </Section>
   </Step>
</Wizard>
```

### Data paths

There is one data state for the wizard. It can either be a single object or an array of objects.

Input controls know about the data state and update it using json path dot notation.

```
<TextInput path="metadata.name" label="Name" required />
```

In many cases an array of items need to be edited.
There is a special control for editing arrays of items.

```
<ArrayInput path="resources" placeholder="Add new resource">
   <TextInput path="metadata.name" label="Name" required />
   <Select path="metadata.namespace" label="Namespace" options={['default']} />
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
