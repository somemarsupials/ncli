import {
  Arguments,
  ChildCommandDefinition,
  CommandDefinition,
  CommandReceived,
  Flags,
  Parameters,
  ParentCommandDefinition
} from "../interfaces";

import { createBigrams, classifyArg, stripFlagDashes } from "./helpers";

interface ParsedArgs {
  args: Arguments;
  flags: Flags;
  parameters: Parameters;
}

interface InterimParsedArgs extends ParsedArgs {
  skip: boolean;
}

type ArgumentType = "argument" | "parameter" | "flag";

const identifyNextArg = (
  { parameters, flags }: ChildCommandDefinition,
  arg: string
): ArgumentType => {
  const { isFlag, value } = classifyArg(arg);

  if (!isFlag) {
    return "argument";
  }

  if (parameters[value]) {
    return "parameter";
  }

  if (flags.includes(value)) {
    return "flag";
  }

  throw new Error("unrecognised flag");
};

const addParameter = (
  { parameters, ...interim }: InterimParsedArgs,
  key: string,
  value: string
): InterimParsedArgs => {
  return {
    ...interim,
    parameters: { ...parameters, [key]: value },
    skip: true
  };
};

const addFlag = (
  { flags, ...interim }: InterimParsedArgs,
  key: string
): InterimParsedArgs => {
  return {
    ...interim,
    flags: [...flags, key]
  };
};

const addArgument = (
  { args, ...interim }: InterimParsedArgs,
  arg: string
): InterimParsedArgs => {
  return {
    ...interim,
    args: [...args, arg]
  };
};

export const parseArgv = (
  commandDefinition: ChildCommandDefinition,
  argv: string[]
): ParsedArgs => {
  const { args, parameters, flags } = createBigrams(argv).reduce(
    (interim, [key, value]) => {
      const type = identifyNextArg(commandDefinition, key);
      const strippedKey = stripFlagDashes(key);

      if (interim.skip) {
        return {
          ...interim,
          skip: false
        };
      }

      switch (type) {
        case "parameter":
          return addParameter(interim, strippedKey, value);
        case "flag":
          return addFlag(interim, strippedKey);
        case "argument":
        default:
          return addArgument(interim, key);
      }
    },
    {
      args: [],
      flags: [],
      parameters: {},
      skip: false
    }
  );

  return {
    args,
    flags,
    parameters
  };
};
