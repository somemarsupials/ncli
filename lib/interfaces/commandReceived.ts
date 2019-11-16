import { Arguments, Flags, HandlerArguments, Parameters } from "./common";

interface CommandReceivedBase {
  args: Arguments;
  execute?: (args: HandlerArguments) => null;
  flags: Flags;
  parameters: Parameters;
}

export interface AnonymousCommandReceived extends CommandReceivedBase {
  isNamed: false;
}

export interface NamedCommandReceived extends CommandReceivedBase {
  isNamed: true;
  name: string;
  path: string;
}

export type CommandReceived = AnonymousCommandReceived | NamedCommandReceived;
