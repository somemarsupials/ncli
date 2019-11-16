import { Flags, Parameters } from "./common";

export interface ParentCommandDefinition {
  subcommands: Record<string, CommandDefinition>;
}

export interface ChildCommandDefinition {
  execute?: () => null;
  flags: Flags;
  parameters: Parameters;
}

export type CommandDefinition =
  | ParentCommandDefinition
  | ChildCommandDefinition;
