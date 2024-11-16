import { type Static, Type } from '@sinclair/typebox';

export const Component = Type.Object({
    componentName: Type.String(),
    componentType: Type.String(),
});

export const ComponentSchema = Component;
export type ComponentType = Static<typeof Component>;

export const WorkspaceShortInfo = Type.Object({
    workspaceId: Type.String(),
    name: Type.String(),
    description: Type.Optional(Type.String()),
    iconImage: Type.Optional(Type.String()),
    components: Type.Optional(Type.Array(Component)),
});

export const WorkspaceShortInfoSchema = WorkspaceShortInfo;
export type WorkspaceShortInfoType = Static<typeof WorkspaceShortInfo>;

const Workspace = Type.Object({
    workspaceId: Type.String(),
    name: Type.String(),
    description: Type.Optional(Type.String()),
    iconImage: Type.Optional(Type.String()),
    components: Type.Optional(Type.Array(Component)),
});

export const WorkspaceSchema = Workspace;
export type WorkspaceType = Static<typeof Workspace>;
