const { Binary } = require("./index");
const os = require("os");
const cTable = require("console.table");

const error = msg => {
  console.error(msg);
  process.exit(1);
};

const { version, name, binaryLocation } = require("./package.json");

const supportedPlatforms = [
  {
    TYPE: "Windows_NT",
    ARCHITECTURE: "x64",
    BINARY_NAME: "amplify-pkg-win.exe"
  },
  {
    TYPE: "Linux",
    ARCHITECTURE: "x64",
    BINARY_NAME: "amplify-pkg-linux"
  },
  {
    TYPE: "Darwin",
    ARCHITECTURE: "x64",
    BINARY_NAME: "amplify-pkg-macos"
  }
];

const getPlatformMetadata = () => {
  const type = os.type();
  const architecture = os.arch();

  for (let index in supportedPlatforms) {
    let supportedPlatform = supportedPlatforms[index];
    if (
      type === supportedPlatform.TYPE &&
      architecture === supportedPlatform.ARCHITECTURE
    ) {
      return supportedPlatform;
    }
  }

  error(
    `Platform with type "${type}" and architecture "${architecture}" is not supported by ${name}.\nYour system must be one of the following:\n\n${cTable.getTable(
      supportedPlatforms
    )}`
  );
};

const getBinary = () => {
  const platformMetadata = getPlatformMetadata();
  const url = `${binaryLocation}/${version}/${platformMetadata.BINARY_NAME}`;
  return new Binary(platformMetadata.BINARY_NAME, url);
};

const run = () => {
  const binary = getBinary();
  binary.run();
};

const install = () => {
  const binary = getBinary();
  binary.install();
};

module.exports = {
  install,
  run
};
