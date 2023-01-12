# PROM-QuestionnaireApp
PROM-QuestionnaireApp is a web application developed Argollo André and Loosli Lukas for the Bachelor Thesis of the University of applied sciences TI.

It is being developed to test the use case of digitizing the process with which the ANQ measures and sends PROM. The connecting services, with which are being communicated are MIDATA.

## Setup
Node and npm have to be installed on your machine. The nodejs package includes both node and npm executables.

### Node
- #### Node installation on Windows

  Go to the [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm with apt install, using the following commands.

```bash
sudo apt install nodejs
sudo apt install npm
```

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.
```bash
node --version
v14.17.5

npm --version
7.24.2
```

If you need to update `npm`, you can update using `npm`.
```bash
npm install npm -g
```

### Repository
To download the repo from github, use `git clone https://github.com/8O0/bachelor_loosl1_argoa1.git` in your terminal.

### Install the dependencies
Then change the directory with `cd bachelor_loosl1_argoa1` and install the dependencies.
```bash
npm i
```

### Start the app in development mode (hot-code reloading, error reporting, etc.).
```bash
npx quasar dev
```


#### Redirect URL for Midata
The MIDATA service needs to know the URL where to redirect the user after successful login.
This can be configured in **quasar.conf.js** with the **VUE_FHIR_REDIRECT_URL** variable (second entry).
Make sure it also includes "/#/" and it is registered as **redirect URI** in the MIDATA app declaration.
