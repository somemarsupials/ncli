import {
  Arguments,
  ChildCommandDefinition,
  Flags,
  Parameters
} from "../interfaces";

import { createBigrams, isFlag, stripFlagDashes } from "./helpers";

interface ParsedArgs {
  args: Arguments;
  flags: Flags;
  parameters: Parameters;
}

interface InterimParsedArgs extends ParsedArgs {
  skip: boolean;
}

type ArgumentType = "argument" | "parameter" | "flag";

interface IdentifiedArg {
  value: string;
  type: ArgumentType;
}

const identifyArgType = (
  { parameters, flags }: ChildCommandDefinition,
  flag: boolean,
  value: string
): ArgumentType => {
  if (!flag) {
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

const identifyArg = (
  commandDefinition: ChildCommandDefinition,
  arg: string
): IdentifiedArg => {
  const value = stripFlagDashes(arg);

  return {
    type: identifyArgType(commandDefinition, isFlag(arg), value),
    value
  };
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
  const { args, parameters, flags } = createBigrams(
    argv.map(arg => identifyArg(commandDefinition, arg))
  ).reduce(
    (interim, [{ type, value }, next]) => {
      if (interim.skip) {
        return {
          ...interim,
          skip: false
        };
      }

      switch (type) {
        case "parameter":
          return addParameter(interim, value, next && next.value);
        case "flag":
          return addFlag(interim, value);
        case "argument":
        default:
          return addArgument(interim, value);
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
