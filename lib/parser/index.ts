import {
  ChildCommandDefinition,
  CommandDefinition,
  CommandReceived
} from "../interfaces";

import { parseArgv } from "./argv";

export const parseCommandDefinition = (
  commandDefinition: CommandDefinition,
  argv: string[],
  path: string[] = []
) => {
  if ("subcommands" in commandDefinition) {
    return matchSubCommand(commandDefinition.subcommands, argv, path);
  } else {
    return parseCommand(commandDefinition, argv, path);
  }
};

const parseCommand = (
  commandDefinition: ChildCommandDefinition,
  argv: string[],
  path: string[]
): CommandReceived => {
  const core = parseArgv(commandDefinition, argv);

  return path.length > 0
    ? {
        ...core,
        isNamed: true,
        name: path[path.length - 1],
        path: path.join(".")
      }
    : { ...core, isNamed: false };
};

const matchSubCommand = (
  subcommands: Record<string, CommandDefinition>,
  [command, ...argv]: string[],
  path: string[]
): CommandReceived => {
  const match = subcommands[command];
  if (match) {
    return parseCommandDefinition(match, argv, [...path, command]);
  } else {
    throw new Error("cannot match command");
  }
};
