# Suppress.js Extra
As mentioned in the models documentation, you can get more models by installing `mix.suppress.js` as a dependency. This package contains a few extra models that are not included in the main package.

The main difference is a wrapper for python, to make it easier to use python ML models in your project.

## Installation
To install the package, run the following command in your project directory:
```bash
npm install mix.suppress.js
```

If you install this, you do not have to install the main package, as it is included in this package.

## Hugging Face
If you want to use a hugging face model, refer to this [documentation](./Models/hugging-face.md).

## Custom Models
To build a custom model, refer to this [documentation](./Models/custom.md). The idea is the same as for vanilla suppresjs, but to make it globally easier, we have created a wrapper for python which is this.
