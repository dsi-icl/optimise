# optimise

Optimise MS is a system for recording data including demographics, clinical events, treatments and tests in a fashion interoperable with [Clinical Data Interchange Standards Consortium (CDISC)](https://www.cdisc.org/) standards for Multiple Sclerosis. Optimise MS allows researchers to better monitor MS patients’ progress, record outcomes and evaluate treatments.

## Getting Started for developpers

```bash
# Fetch this repo
git clone https://github.com/dsi-icl/optimise optimise
cd optimise

# Bootstrap the Lerna project, will install all modules
yarn install
```

## Folder structure

The main idea of this starer kit is to separate the Electron and React parts.

```
.
├── package.json                  # Package.json for the whole repo
├── packages/
│   ├── optimise-core/            # Folder where the Optimise backend can be found
│   ├── optimise-docker/          # Configuration files for the Optimise Docker image
│   ├── optimise-electron/        # Packager configuration for the desktop app
│   ├── optimise-ui/              # Folder where the Optimise frontend can be found
│   ├── optimise-website/         # The optimise-ms.org website
```

## License

MIT.
